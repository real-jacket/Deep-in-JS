class Point {
  x: number | string;
  y!: number | string;

  constructor(x: number, y: number);
  constructor(x: number, y: string);
  constructor(s: string);
  constructor(xs: any, y?: any);

  constructor(x, y?) {
    this.x = x;
    y && (this.y = y);
  }
}

const pt = new Point(1, 2);

pt.x = 10;
pt.y = 10;

class Greeter {
  readonly name: string = 'world';

  constructor(otherName?: string) {
    if (otherName !== undefined) {
      this.name = otherName;
    }
  }

  err() {
    // this.name = 'not ok';
  }
}
