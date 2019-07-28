class Revealer {
  constructor(el, options) {
    this.options = { angle: 0, ...options };
    this.DOM = {
      el,
      inner: el.firstElementChild,
      reverse: el.firstElementChild.querySelector('.content__reverse'),
    };

    const cos = Math.abs(Math.cos((this.options.angle * Math.PI) / 180));
    const sin = Math.abs(Math.sin((this.options.angle * Math.PI) / 180));
    this.DOM.inner.style.width = `calc(100vw * ${cos} + 100vh * ${sin})`;
    this.DOM.inner.style.height = `calc(100vw * ${sin} + 100vh * ${cos})`;

    const rotate = `rotate3d(0,0,1,${this.options.angle}deg)`;
    this.DOM.el.style.transform = rotate;
    this.DOM.el.style.setProperty('--angle', this.options.angle);

    if (this.DOM.reverse) {
      const rev = `rotate3d(0,0,1,${-1 * this.options.angle}deg)`;
      this.DOM.reverse.style.transform = rev;
      this.DOM.reverse.style.setProperty('--angle', -1 * this.options.angle);
    }

    this.animate = this.animate.bind(this);
    this.reverse = this.reverse.bind(this);
    this.setup = this.setup.bind(this);
  }

  setup(delay) {
    this.DOM.inner.style['transition-delay'] = !!delay ? delay : `${0}s`;
    this.DOM.inner.classList.add('transition');
    if (this.DOM.reverse) {
      this.DOM.reverse.style['transition-delay'] = !!delay ? delay : `${0}s`;
      this.DOM.reverse.classList.add('transition');
    }
  }

  reverse(delay) {
    this.setup(delay);
    this.DOM.inner.classList.remove('animate-move');
    if (this.DOM.reverse) {
      this.DOM.reverse.classList.remove('animate-reverse');
    }
  }

  animate(delay) {
    this.setup(delay);
    this.DOM.inner.classList.add('animate-move');
    if (this.DOM.reverse) {
      this.DOM.reverse.classList.add('animate-reverse');
    }
  }
}

const content = {
  first: document.querySelector('.content--first'),
  second: document.querySelector('.content--second'),
  overlayElems: [...document.querySelectorAll('.overlay')],
};

content.enter = content.first.querySelector('.intro__enter');
content.backCtrl = content.second.querySelector('.content__back');

function setup({ angle, delta: d }) {
  const revealer = new Revealer(content.first, { angle });
  let overlays = [];
  if (Array.isArray(content.overlayElems)) {
    overlays = content.overlayElems.map(
      (o, i) => new Revealer(o, { angle: i % 2 === 0 ? -1 * angle : angle }),
    );
  }

  const delta = !isNaN(+d) ? +d : 0;
  content.enter.addEventListener('click', () => {
    content.first.classList.add('content--hidden');
    [revealer, ...overlays.slice().reverse()].forEach((o, i) =>
      o.animate(`${delta * i}s`),
    );
  });

  content.backCtrl.addEventListener('click', () => {
    content.first.classList.remove('content--hidden');
    [...overlays, revealer].forEach((o, i) => o.reverse(`${delta * i}s`));
  });
}
