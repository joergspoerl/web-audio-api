import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  @ViewChild('myplayer1') playerElement: ElementRef;
  @ViewChild('test') testElement: ElementRef;

  private audioContext: AudioContext;
  private MediaPlayer: MediaElementAudioSourceNode;
  private loadingSample: boolean = false;
  private audioBuffer: AudioBuffer;
  private bufferSource: AudioBufferSourceNode;
  private lGain: GainNode;
  private mGain: GainNode;
  private hGain: GainNode;

  constructor(public navCtrl: NavController) {
  }

  ngOnInit() {
    this.audioContext = new AudioContext();

    this.MediaPlayer  = this.audioContext.createMediaElementSource(this.playerElement.nativeElement);
    this.playerElement.nativeElement.addEventListener("play", 
      () => { 
        console.log("play"); 
        this.initEq(this.audioContext, this.MediaPlayer)
      }, true);

    this.initSourceBuffer();

  }

  initSourceBuffer() {
    this.loadingSample = true;
    this.fetchSample()
        .then(audioBuffer => {
            this.loadingSample = false;
            this.audioBuffer = audioBuffer as AudioBuffer;
        })
        .catch(error => {throw error});

  }

  fetchSample(): Promise<Object> {
    return fetch('http://api.audiotool.com/track/volution/play.mp3')
      .then(response => response.arrayBuffer())
      .then(buffer => {
        return new Promise((resolve, reject) => {
          this.audioContext.decodeAudioData(
            buffer,
            resolve,
            reject
          );
        })
      });
  }

  playSample() {
    this.bufferSource = this.audioContext.createBufferSource();
    this.bufferSource.buffer = this.audioBuffer;
    this.bufferSource.connect(this.audioContext.destination);
    this.initEq(this.audioContext, this.bufferSource);
    this.bufferSource.start(0);
}

  start() {
    this.playSample();
  }

  stop() {
    this.bufferSource.stop(0);
  }

  initEq (audioContext, source) {
      //   // EQ Properties
  //   //
    var gainDb = -40.0;
    var bandSplit = [360, 3600];

    var hBand = audioContext.createBiquadFilter();
    hBand.type = "lowshelf";
    hBand.frequency.value = bandSplit[0];
    hBand.gain.value = gainDb;

    var hInvert = audioContext.createGain();
    hInvert.gain.value = -1.0;

    var mBand = audioContext.createGain();

    var lBand = audioContext.createBiquadFilter();
    lBand.type = "highshelf";
    lBand.frequency.value = bandSplit[1];
    lBand.gain.value = gainDb;

    var lInvert = audioContext.createGain();
    lInvert.gain.value = -1.0;

    source.connect(lBand);
    source.connect(mBand);
    source.connect(hBand);

    hBand.connect(hInvert);
    lBand.connect(lInvert);

    hInvert.connect(mBand);
    lInvert.connect(mBand);

    this.lGain = audioContext.createGain();
    this.mGain = audioContext.createGain();
    this.hGain = audioContext.createGain();

    lBand.connect(this.lGain);
    mBand.connect(this.mGain);
    hBand.connect(this.hGain);

    var sum = audioContext.createGain();
    this.lGain.connect(sum);
    this.mGain.connect(sum);
    this.hGain.connect(sum);
    sum.connect(audioContext.destination);

    //this.lGain.gain.value = 0
  }



  changeGain(string, comp) {
    console.log("changeGain:", string, comp)

    let value = parseFloat(string) / 100.0;

      switch (comp) {
        case 'lowGain': this.lGain.gain.value = value; break;
        case 'midGain': this.mGain.gain.value = value; break;
        case 'highGain': this.hGain.gain.value = value; break;
      }

    // console.log("playerElement", this.playerElement)
    // console.log("testElement", this.testElement)
  }

  // old() {
  //   // How to hack an equalizer with two biquad filters
  //   //
  //   // 1. Extract the low frequencies (highshelf)
  //   // 2. Extract the high frequencies (lowshelf)
  //   // 3. Subtract low and high frequencies (add invert) from the source for the mid frequencies.
  //   // 4. Add everything back together
  //   //
  //   // andre.michelle@gmail.com

  //   var context = new AudioContext();
  //   var mediaElement = document.getElementById('player');
  //   var sourceNode = context.createMediaElementSource(mediaElement);

  //   // EQ Properties
  //   //
  //   var gainDb = -40.0;
  //   var bandSplit = [360, 3600];

  //   var hBand = context.createBiquadFilter();
  //   hBand.type = "lowshelf";
  //   hBand.frequency.value = bandSplit[0];
  //   hBand.gain.value = gainDb;

  //   var hInvert = context.createGain();
  //   hInvert.gain.value = -1.0;

  //   var mBand = context.createGain();

  //   var lBand = context.createBiquadFilter();
  //   lBand.type = "highshelf";
  //   lBand.frequency.value = bandSplit[1];
  //   lBand.gain.value = gainDb;

  //   var lInvert = context.createGain();
  //   lInvert.gain.value = -1.0;

  //   sourceNode.connect(lBand);
  //   sourceNode.connect(mBand);
  //   sourceNode.connect(hBand);

  //   hBand.connect(hInvert);
  //   lBand.connect(lInvert);

  //   hInvert.connect(mBand);
  //   lInvert.connect(mBand);

  //   var lGain = context.createGain();
  //   var mGain = context.createGain();
  //   var hGain = context.createGain();

  //   lBand.connect(lGain);
  //   mBand.connect(mGain);
  //   hBand.connect(hGain);

  //   var sum = context.createGain();
  //   lGain.connect(sum);
  //   mGain.connect(sum);
  //   hGain.connect(sum);
  //   sum.connect(context.destination);

  //   // Input
  //   //
  //   function changeGain(string, type) {
  //     var value = parseFloat(string) / 100.0;

  //     switch (type) {
  //       case 'lowGain': lGain.gain.value = value; break;
  //       case 'midGain': mGain.gain.value = value; break;
  //       case 'highGain': hGain.gain.value = value; break;
  //     }
  //   }

  // }
}
