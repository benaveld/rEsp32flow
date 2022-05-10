export class ProfileStep {
  timer: number = 0;
  temperature: number = 0;
  Kp: number = 0;
  Ki: number = 0;
  Kd: number = 0;

  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.timer) this.timer = initializer.timer;
    if (initializer.temperature) this.temperature = initializer.temperature;
    if (initializer.Kp) this.Kp = initializer.Kp;
    if (initializer.Ki) this.Ki = initializer.Ki;
    if (initializer.Kd) this.Kd = initializer.Kd;
  }
}