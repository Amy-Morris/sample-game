export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.setBaseURL('assets/');

    this.load.atlas('atlas');

    this.load.audio('gray', 'gray.wav');
    this.load.audio('green', 'green.wav');
    this.load.audio('red', 'red.wav');
  }

  create() {
    this.scene.start('MainScene');
  }
}
