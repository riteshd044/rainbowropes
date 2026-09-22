class Cursor {
  constructor(options) {
    this.options = $.extend(
      true,
      {
        container: "body",
        speed: 0.7,
        ease: "expo.out",
        visibleTimeout: 300,
      },
      options,
    );
    this.body = $(this.options.container);
    this.el = $('<div class="cb-cursor"></div>');
    this.text = $('<div class="cb-cursor-text"></div>');
    this.init();
  }

  isMobile() {
    return (
      window.innerWidth <= 991 ||
      window.matchMedia("(hover: none), (pointer: coarse)").matches
    );
  }

  init() {
    this.el.append(this.text);
    this.body.append(this.el);
    this.bind();
    this.move(-window.innerWidth, -window.innerHeight, 0);
    if (this.isMobile()) {
      this.hide();
    }
  }

  reset() {
    clearTimeout(this.visibleInt);
    this.visible = false;
    this.removeText();
    this.removeState("-active");
    this.removeState("-pointer");
    this.removeState("-text");
    this.removeState("-visible");
    this.removeStick();
    this.move(-window.innerWidth, -window.innerHeight, 0);
  }

  bind() {
    const self = this;

    this.body
      .on("mouseleave", () => {
        self.hide();
      })
      .on("mouseenter", () => {
        if (self.isMobile()) return;
        self.show();
      })
      .on("mousemove", (e) => {
        if (self.isMobile()) {
          self.hide();
          return;
        }
        this.pos = {
          x: this.stick
            ? this.stick.x - (this.stick.x - e.clientX) * 0.15
            : e.clientX,
          y: this.stick
            ? this.stick.y - (this.stick.y - e.clientY) * 0.15
            : e.clientY,
        };
        this.update();
      })
      .on("mousedown", () => {
        if (self.isMobile()) return;
        self.setState("-active");
      })
      .on("mouseup", () => {
        if (self.isMobile()) return;
        self.removeState("-active");
      })
      .on("mouseenter", "a,input,textarea,button", () => {
        if (self.isMobile()) return;
        self.setState("-pointer");
      })
      .on("mouseleave", "a,input,textarea,button", () => {
        if (self.isMobile()) return;
        self.removeState("-pointer");
      })
      .on("mouseenter", "iframe", () => {
        self.hide();
      })
      .on("mouseleave", "iframe", () => {
        if (self.isMobile()) return;
        self.show();
      })
      .on("mouseenter", "[data-cursor]", function () {
        if (self.isMobile()) return;
        self.setState(this.dataset.cursor);
      })
      .on("mouseleave", "[data-cursor]", function () {
        self.removeState(this.dataset.cursor);
      })
      .on("mouseenter", "[data-cursor-text]", function () {
        if (self.isMobile()) return;
        self.setText(this.dataset.cursorText);
      })
      .on("mouseleave", "[data-cursor-text]", function () {
        self.removeText();
      })
      .on("mouseenter", "[data-cursor-stick]", function () {
        if (self.isMobile()) return;
        self.setStick(this.dataset.cursorStick);
      })
      .on("mouseleave", "[data-cursor-stick]", function () {
        self.removeStick();
      });

    // Reset cursor immediately when clicking links to avoid cursor staying frozen on page transition
    this.body.on("click", "a", () => {
      self.reset();
    });

    // Dismiss cursor on touch interaction
    window.addEventListener(
      "touchstart",
      () => {
        self.reset();
      },
      { passive: true },
    );

    // Clean up on page navigation & BFCache restore (back/forward cache)
    window.addEventListener("pageshow", () => {
      self.reset();
    });

    window.addEventListener("pagehide", () => {
      self.reset();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        self.reset();
      }
    });

    window.addEventListener("resize", () => {
      if (self.isMobile()) {
        self.reset();
      }
    });
  }

  setState(state) {
    if (this.isMobile()) return;
    this.el.addClass(state);
  }

  removeState(state) {
    this.el.removeClass(state);
  }

  toggleState(state) {
    if (this.isMobile()) return;
    this.el.toggleClass(state);
  }

  setText(text) {
    if (this.isMobile()) return;
    this.text.html(text);
    this.el.addClass("-text");
  }

  removeText() {
    this.el.removeClass("-text");
    this.text.empty();
  }

  setStick(el) {
    if (this.isMobile()) return;
    const target = $(el);
    if (!target.length) return;
    const bound = target.get(0).getBoundingClientRect();
    this.stick = {
      y: bound.top + target.height() / 2,
      x: bound.left + target.width() / 2,
    };
    this.move(this.stick.x, this.stick.y, 5);
  }

  removeStick() {
    this.stick = false;
  }

  update() {
    if (this.isMobile()) return;
    this.move();
    this.show();
  }

  move(x, y, duration) {
    if (this.isMobile()) return;
    const posX =
      x !== undefined ? x : this.pos ? this.pos.x : -window.innerWidth;
    const posY =
      y !== undefined ? y : this.pos ? this.pos.y : -window.innerHeight;
    gsap.to(this.el, {
      x: posX,
      y: posY,
      force3D: true,
      overwrite: true,
      ease: this.options.ease,
      duration: this.visible ? duration || this.options.speed : 0,
    });
  }

  show() {
    if (this.isMobile() || this.visible) return;
    clearTimeout(this.visibleInt);
    this.el.addClass("-visible");
    this.visibleInt = setTimeout(() => (this.visible = true));
  }

  hide() {
    clearTimeout(this.visibleInt);
    this.el.removeClass("-visible");
    this.visibleInt = setTimeout(
      () => (this.visible = false),
      this.options.visibleTimeout,
    );
  }
}
// Init cursor
const cursor = new Cursor();
