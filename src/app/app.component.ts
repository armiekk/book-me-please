import { AfterViewInit, Component } from '@angular/core';
import Konva from 'konva';
import { Layer } from 'konva/types/Layer';
import { Node } from 'konva/types/Node';
import { Image } from 'konva/types/shapes/Image';
import { Stage } from 'konva/types/Stage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  stage: Stage;
  floorplanLayer: Layer;
  seatLayer: Layer;
  seatLocationList = [
    // row 1
    {
      id: 1,
      position: 'top',
      booked: false,
      available: true,
      x: 28,
      y: 16
    },
    {
      id: 2,
      position: 'top',
      booked: false,
      available: true,
      x: 102,
      y: 16
    },
    {
      id: 3,
      position: 'top',
      booked: false,
      available: false,
      x: 176,
      y: 16
    },
    {
      id: 4,
      position: 'top',
      booked: false,
      available: true,
      x: 250,
      y: 16
    },
    // row 2
    {
      id: 5,
      position: 'bottom',
      booked: false,
      available: true,
      x: 28,
      y: 150
    },
    {
      id: 6,
      position: 'bottom',
      booked: false,
      available: false,
      x: 102,
      y: 150
    },
    {
      id: 7,
      position: 'bottom',
      booked: false,
      available: true,
      x: 176,
      y: 150
    },
    {
      id: 8,
      position: 'bottom',
      booked: false,
      available: true,
      x: 250,
      y: 150
    },
    // row 3
    {
      id: 9,
      position: 'top',
      booked: false,
      available: false,
      x: 28,
      y: 264
    },
    {
      id: 10,
      position: 'top',
      booked: false,
      available: true,
      x: 102,
      y: 264
    },
    {
      id: 11,
      position: 'top',
      booked: false,
      available: true,
      x: 176,
      y: 264
    },
    {
      id: 12,
      position: 'top',
      booked: false,
      available: true,
      x: 250,
      y: 264
    },
    // row 4
    {
      id: 13,
      position: 'bottom',
      booked: false,
      available: true,
      x: 28,
      y: 398
    },
    {
      id: 14,
      position: 'bottom',
      booked: false,
      available: true,
      x: 102,
      y: 398
    },
    {
      id: 15,
      position: 'bottom',
      booked: false,
      available: true,
      x: 176,
      y: 398
    },
    {
      id: 16,
      position: 'bottom',
      booked: false,
      available: true,
      x: 250,
      y: 398
    }
  ];

  constructor() {
  }

  ngAfterViewInit() {
    this.setupStage();
    this.setupLayer();
    this.drawFloorPlan();
    this.drawSeat();

    this.stage.draw();
  }

  private setupLayer() {
    this.floorplanLayer = new Konva.Layer();
    this.seatLayer = new Konva.Layer();
    this.stage.add(this.floorplanLayer);
    this.stage.add(this.seatLayer);
  }

  private setupStage() {
    this.stage = new Konva.Stage({
      container: 'container',
      width: 512,
      height: 512,
      draggable: true,
    });

    this.stage.container().style.backgroundColor = '#F4F4F4';
  }

  private drawFloorPlan() {
    const meetingRoom1 = new Konva.Rect({
      width: 125,
      height: 361,
      x: 387,
      fill: 'rgba(65, 65, 65, 0.1)',
    });

    const meetingRoom2 = new Konva.Rect({
      width: 125,
      height: 114,
      x: 387,
      y: 398,
      fill: 'rgba(65, 65, 65, 0.1)',
    });

    const desk1 = new Konva.Rect({
      width: 300,
      height: 70,
      x: 16,
      y: 80,
      fill: 'rgba(65, 65, 65, 0.1)',
      cornerRadius: 4
    });

    const desk2 = new Konva.Rect({
      width: 300,
      height: 70,
      x: 16,
      y: 328,
      fill: 'rgba(65, 65, 65, 0.1)',
      cornerRadius: 4
    });

    this.getImage('assets/images/compass.svg').then((compassImg: Image) => {
      this.floorplanLayer.add(compassImg);
      compassImg.setAttrs({
        x: 422,
        y: 418
      });
      this.floorplanLayer.batchDraw();
    })

    this.floorplanLayer.add(meetingRoom1);
    this.floorplanLayer.add(meetingRoom2);
    this.floorplanLayer.add(desk1);
    this.floorplanLayer.add(desk2);
  }

  private drawSeat() {
    this.seatLocationList.forEach(({ x, y, id, position, booked, available }) => {
      let seatImgUrl: string;

      if (!booked && available) {
        seatImgUrl = 'assets/images/seat.svg';
      } else if (booked) {
        seatImgUrl = 'assets/images/seat_selected.svg';
      } else if (!available) {
        seatImgUrl = 'assets/images/seat_disable.svg';
      }

      this.drawSeatByStatus(seatImgUrl, position, x, y, id, booked, available);
    });

  }

  private drawSeatByStatus(seatUrl: string, position: string, x: number, y: number, id: number, booked: boolean, available: boolean) {
    this.getImage(seatUrl).then((seatImageNode: Image) => {
      this.seatLayer.add(seatImageNode);

      if (position === 'bottom') {
        seatImageNode.rotate(180);
        seatImageNode.setAttrs({
          x: x + seatImageNode.getWidth(),
          y: y + seatImageNode.getHeight()
        });
      } else {
        seatImageNode.setAttrs({
          x,
          y
        });
      }
      if (!booked && available) {
        this.registerBookEvent(seatImageNode, booked, id);
      }
      this.seatLayer.batchDraw();
    });
  }

  private registerBookEvent(seatImageNode: Image, booked: boolean, id: number) {
    seatImageNode.on('click tap', () => {
      if (booked) {
        return;
      }

      const confirmBook = confirm(`Book seat number ${id} ?`);
      if (confirmBook) {
        const seatIndex = this.seatLocationList.findIndex(seat => seat.id === id);
        const bookedSeat = { ...this.seatLocationList[seatIndex], booked: true };
        this.seatLocationList = [
          ...this.seatLocationList.slice(0, seatIndex + 1),
          bookedSeat,
          ...this.seatLocationList.slice(seatIndex)
        ];
        this.seatLayer.destroyChildren();
        this.drawSeat();
        this.stage.draw();
      }
    });
  }

  private getImage(imageUrl: string) {
    return new Promise((resolve, reject) => {
      Konva.Image.fromURL(imageUrl, (image: Image) => {
        if (!image) {
          reject('no image return.');
        }
        resolve(image);
      });
    });
  }
}
