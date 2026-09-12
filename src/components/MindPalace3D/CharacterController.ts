// CharacterController.ts
// Handles smooth 3rd-person & 1st-person character physics, input handling, and animation

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
  jump: boolean;
  interact: boolean;
}

export class CharacterController {
  public input: InputState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    jump: false,
    interact: false,
  };

  // Joystick virtual input (-1 to 1)
  public joystickVector = { x: 0, y: 0 };

  // Character physical state
  public position = { x: 0, y: 0, z: 0 };
  public rotation = 0; // Yaw in radians
  public velocity = { x: 0, z: 0 };
  public velocityY = 0;
  public isGrounded = true;
  public isMoving = false;
  public moveSpeed = 0;

  // Animation cycle (0 to 2*PI)
  public walkCycle = 0;
  public stepTimer = 0;

  // Camera state
  public cameraYaw = 0; // Horizontal orbit angle
  public cameraPitch = 0.35; // Vertical orbit angle (~20 deg down)
  public cameraDistance = 6.5; // Distance from character in 3rd person
  public isFirstPerson = false;

  private onFootstepCallback?: () => void;
  private onInteractCallback?: () => void;
  public onVoiceInteractCallback?: () => void;

  constructor(
    onFootstep?: () => void,
    onInteract?: () => void,
    onVoiceInteract?: () => void
  ) {
    this.onFootstepCallback = onFootstep;
    this.onInteractCallback = onInteract;
    this.onVoiceInteractCallback = onVoiceInteract;
    this.bindKeyboardEvents();
  }

  public setPosition(x: number, y: number, z: number, rotation: number = 0) {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.velocity.x = 0;
    this.velocity.z = 0;
    this.rotation = rotation;
    this.cameraYaw = rotation;
    this.velocityY = 0;
    this.isGrounded = true;
    this.isMoving = false;
    this.moveSpeed = 0;
    this.walkCycle = 0;
  }

  // Direct virtual input helpers for UI buttons
  public setForward(val: boolean) {
    this.input.forward = val;
  }
  public setBackward(val: boolean) {
    this.input.backward = val;
  }
  public setLeft(val: boolean) {
    this.input.left = val;
  }
  public setRight(val: boolean) {
    this.input.right = val;
  }
  public setSprint(val: boolean) {
    this.input.sprint = val;
  }
  public jumpAction() {
    if (this.isGrounded) {
      this.velocityY = 6.8;
      this.isGrounded = false;
    }
  }
  public triggerInteract() {
    if (this.onInteractCallback) {
      this.onInteractCallback();
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
      // Avoid capturing input when typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          this.input.forward = true;
          break;
        case "KeyS":
        case "ArrowDown":
          this.input.backward = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          this.input.left = true;
          break;
        case "KeyD":
        case "ArrowRight":
          this.input.right = true;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          this.input.sprint = true;
          break;
        case "Space":
          this.input.jump = true;
          e.preventDefault();
          break;
        case "KeyE":
        case "Enter":
          this.input.interact = true;
          if (this.onInteractCallback) {
            this.onInteractCallback();
          }
          break;
        case "KeyV":
          // Toggle perspective
          this.isFirstPerson = !this.isFirstPerson;
          break;
        case "KeyT":
          if (this.onVoiceInteractCallback) {
            this.onVoiceInteractCallback();
          }
          break;
      }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          this.input.forward = false;
          break;
        case "KeyS":
        case "ArrowDown":
          this.input.backward = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          this.input.left = false;
          break;
        case "KeyD":
        case "ArrowRight":
          this.input.right = false;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          this.input.sprint = false;
          break;
        case "Space":
          this.input.jump = false;
          break;
        case "KeyE":
        case "Enter":
          this.input.interact = false;
          break;
      }
  };

  private bindKeyboardEvents() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  public dispose() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  public update(deltaSeconds: number, boundaryRadius: number = 32) {
    const dt = Math.min(deltaSeconds, 0.1);

    // Compute desired move direction based on cameraYaw
    let moveX = 0;
    let moveZ = 0;

    // Keyboard inputs
    if (this.input.forward) moveZ -= 1;
    if (this.input.backward) moveZ += 1;
    if (this.input.left) moveX -= 1;
    if (this.input.right) moveX += 1;

    // Virtual Joystick inputs
    if (Math.abs(this.joystickVector.x) > 0.1 || Math.abs(this.joystickVector.y) > 0.1) {
      moveX = this.joystickVector.x;
      moveZ = -this.joystickVector.y; // Invert so up is forward
    }

    const inputMagnitude = Math.sqrt(moveX * moveX + moveZ * moveZ);
    this.isMoving = inputMagnitude > 0.1;

    let targetVx = 0;
    let targetVz = 0;

    if (this.isMoving) {
      const normX = moveX / Math.max(1, inputMagnitude);
      const normZ = moveZ / Math.max(1, inputMagnitude);

      // Rotate input direction by cameraYaw
      const cosY = Math.cos(this.cameraYaw);
      const sinY = Math.sin(this.cameraYaw);
      const worldDirX = normX * cosY - normZ * sinY;
      const worldDirZ = normX * sinY + normZ * cosY;

      // Smoothly rotate character toward movement direction
      const targetRotation = Math.atan2(worldDirX, worldDirZ);
      let diff = targetRotation - this.rotation;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      this.rotation += diff * Math.min(1, 14 * dt);

      // Target velocity
      const baseSpeed = this.input.sprint ? 11.5 : 6.5;
      const speed = baseSpeed * Math.min(1, inputMagnitude);
      targetVx = worldDirX * speed;
      targetVz = worldDirZ * speed;
    }

    // Smooth acceleration & friction damping
    const accelRate = this.isMoving ? 14.0 : 10.0;
    this.velocity.x += (targetVx - this.velocity.x) * Math.min(1, accelRate * dt);
    this.velocity.z += (targetVz - this.velocity.z) * Math.min(1, accelRate * dt);

    // Stop micro-jitter
    if (!this.isMoving && Math.abs(this.velocity.x) < 0.05 && Math.abs(this.velocity.z) < 0.05) {
      this.velocity.x = 0;
      this.velocity.z = 0;
    }

    this.position.x += this.velocity.x * dt;
    this.position.z += this.velocity.z * dt;
    this.moveSpeed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);

    if (this.moveSpeed > 0.3) {
      // Animate walk cycle smoothly
      this.walkCycle += this.moveSpeed * 1.8 * dt;

      // Footstep audio trigger
      this.stepTimer += dt * (this.input.sprint ? 2.8 : 2.0);
      if (this.stepTimer >= 1.0) {
        this.stepTimer = 0;
        if (this.onFootstepCallback && this.isGrounded) {
          this.onFootstepCallback();
        }
      }
    } else {
      // Damped walkCycle return to neutral
      this.walkCycle %= Math.PI * 2;
      this.stepTimer = 0.5;
    }

    // Jump & Gravity physics
    if (this.input.jump && this.isGrounded) {
      this.velocityY = 6.5;
      this.isGrounded = false;
    }

    if (!this.isGrounded) {
      this.velocityY -= 18.0 * dt; // Gravity
      this.position.y += this.velocityY * dt;
      if (this.position.y <= 0) {
        this.position.y = 0;
        this.velocityY = 0;
        this.isGrounded = true;
      }
    }

    // World boundary constraint (keep inside circular room or square hall)
    const distanceFromCenter = Math.sqrt(
      this.position.x * this.position.x + this.position.z * this.position.z
    );
    if (distanceFromCenter > boundaryRadius) {
      const angle = Math.atan2(this.position.z, this.position.x);
      this.position.x = Math.cos(angle) * boundaryRadius;
      this.position.z = Math.sin(angle) * boundaryRadius;
    }
  }
}
