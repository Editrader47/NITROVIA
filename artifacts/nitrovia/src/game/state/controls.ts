export enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
  handbrake = "handbrake",
  nitro = "nitro",
  horn = "horn",
  pause = "pause",
  cameraToggle = "cameraToggle",
}

export const CONTROL_KEY_MAP = [
  { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
  { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
  { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
  { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
  { name: Controls.handbrake, keys: ["Space"] },
  { name: Controls.nitro, keys: ["ShiftLeft", "ShiftRight"] },
  { name: Controls.horn, keys: ["KeyH"] },
  { name: Controls.pause, keys: ["Escape"] },
  { name: Controls.cameraToggle, keys: ["KeyC"] },
];
