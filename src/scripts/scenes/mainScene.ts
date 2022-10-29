export default class MainScene extends Phaser.Scene {
  private speed = 300;
  private bg: Phaser.GameObjects.Image;

  private player: Phaser.GameObjects.Sprite;
  private podium: Phaser.GameObjects.Sprite;
  private base: Phaser.GameObjects.Sprite;
  private one: Phaser.GameObjects.Sprite;
  private two: Phaser.GameObjects.Sprite;
  private three: Phaser.GameObjects.Sprite;

  private lightTimer: Phaser.Time.TimerEvent;

  private tapTimer: Phaser.Time.TimerEvent | null;

  private audio: any = {
    gray: null,
    red: null,
    green: null
  };

  private running: boolean = false;

  private output: string = '';

  private canTap: boolean = false;

  constructor() {
    super({ key: 'MainScene' });
  }

  init() {
    // this.speed = Phaser.Math.Between(800, 1500);
  }

  create() {
    this.audio.gray = this.sound.add('gray');
    this.audio.red = this.sound.add('red');
    this.audio.green = this.sound.add('green');

    this.bg = this.add.image(0, 0, 'atlas', 'bg').setOrigin(0);

    this.base = this.add.sprite(0, 640 - 146, 'atlas', 'base').setOrigin(0);
    this.player = this.add
      .sprite(80, this.base.y - 60, 'atlas', 'player')
      .setOrigin(0);
    this.podium = this.add.sprite(250, 267 - 1, 'atlas', 'podium').setOrigin(0);

    const boxDimensions = { x: this.podium.x - this.podium.width, y: 250 };

    this.one = this.add
      .sprite(boxDimensions.x, boxDimensions.y, 'atlas', AtlasKey.Gray)
      .setOrigin(0);

    this.two = this.add
      .sprite(
        boxDimensions.x,
        boxDimensions.y + this.one.height + 20,
        'atlas',
        'gray'
      )
      .setOrigin(0);

    this.three = this.add
      .sprite(
        boxDimensions.x,
        boxDimensions.y + this.one.height * 2 + 40,
        'atlas',
        'gray'
      )
      .setOrigin(0);

    this.lightTimer = this.time.addEvent(this.lightTimerConfig());

    this.input.on('pointerdown', () => {
      if (!this.running) {
        this.output = '';
        this.running = true;
        this.lightTimer.paused = !this.lightTimer.paused;
        return;
      }

      if (this.canTap) {
        const tapTime = this.tapTimer?.getProgress().toFixed(2) as string;

        console.log({ tapTime });
        console.log(parseFloat(tapTime));
        if (parseFloat(tapTime) >= 0.4 && parseFloat(tapTime) <= 0.6) {
          this.output = 'Excellent!' + '\n' + 'Tap Time: ' + tapTime;
        } else {
          this.output = 'Not so good!' + '\n' + 'Tap Time: ' + tapTime;
        }
      }
    });
  }

  update() {
    // half way after the last
    if (
      this.lightTimer.repeatCount === 1 &&
      this.lightTimer.getProgress() > 0.5 &&
      !this.tapTimer
    ) {
      this.canTap = true;
      console.log('tap available');
      // this timer is the window where tapping is allowed
      // it is configured to start halfway through the last red light
      // and end halfway through the first green light
      this.tapTimer = this.time.addEvent(this.tapTimerConfig());
    }
  }

  reset() {
    this.lightTimer.reset(this.lightTimerConfig());

    if (this.tapTimer) {
      this.tapTimer.destroy();
      this.tapTimer = null;
    }

    this.running = false;
  }

  setAllToGray() {
    this.audio.gray.play();
    this.one.setTexture('atlas', AtlasKey.Gray);
    this.two.setTexture('atlas', AtlasKey.Gray);
    this.three.setTexture('atlas', AtlasKey.Gray);
  }

  changeColor(num: number) {
    if (num === 3) {
      this.audio.red.play();
      this.three.setTexture('atlas', AtlasKey.Red);
    } else if (num === 2) {
      this.audio.red.play();
      this.two.setTexture('atlas', AtlasKey.Red);
    } else if (num === 1) {
      this.audio.green.play();
      this.one.setTexture('atlas', AtlasKey.Green);
    }
  }

  private tapTimerConfig() {
    return {
      delay: this.speed,
      callback: () => {
        this.setAllToGray();
        this.canTap = false;
        console.log('tap unavailable');
        this.reset();
      }
    };
  }

  private lightTimerConfig(): LightTimerConfig {
    return {
      delay: this.speed,
      repeat: 3,
      paused: true,
      callback: () => {
        this.changeColor(this.lightTimer.repeatCount);

        // second light on
        if (this.lightTimer.repeatCount === 2) {
          console.log('second light turned on');
        }

        // green light on
        if (this.lightTimer.repeatCount === 1) {
          console.log(
            'TIMER when GREEN: ' + this.tapTimer?.getProgress().toFixed(2)
          );
        }

        if (this.lightTimer.repeatCount === 0) {
          this.setAllToGray();
        }
      }
    };
  }
}

export type LightTimerConfig = {
  delay: number;
  repeat: number;
  paused: boolean;
  callback: () => void;
};

export const AtlasKey = {
  Red: 'red',
  Green: 'green',
  Gray: 'gray'
} as const;
