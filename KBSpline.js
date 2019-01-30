class KBSpline
{
  constructor(el, data)
  {
    (el && el.tagName && el.tagName.toLowerCase()==='div') ? this.init(el, data) : null;
  }
  /* methods */
  init(el, data)
  {
    var that = this;
    data = (!data) ? {
      t: null,
      c: null,
      b: null,
      p: null
    } : data;

    try
    {
      that.setElem(el);
      that.setT(data.t);
      that.setB(data.b);
      that.setC(data.c);
      that.setFrac();
      that.setP(data.p);
      that.setD();
      that.setH();
    } catch (err)
    {
      that.oops(err);
    }
  }
  initRenderObject(w, h)
  {
    var that = this;
    w = (!w && h) ? h : w;
    h = (!h && w) ? w : h;
    if (w && h)
    {
      that.cvs = document.createElement('canvas');
      that.cvs.setAttribute('width', w);
      that.cvs.setAttribute('height', h);
      that.ctx = that.cvs.getContext('2d');
      that.elem.appendChild(that.cvs);
    }
  }
  setElem(el)
  {
    var that = this;
    that.elem = el;
    that.initRenderObject(
      parseInt(that.elem.style.width),
      parseInt(that.elem.style.height)
    );
  }
  setT(tPar)
  {
    var that = this;
    that.t = (!tPar) ? 0 : (tPar>=(-1) && tPar<=1) ? tPar : null;
  }
  getT() { var that = this; return that.t; }
  setB(bPar)
  {
    var that = this;
    that.b = (!bPar) ? 0 : (bPar>=(-1) && bPar<=1) ? bPar : null;
  }
  getB() { var that = this; return that.b; }
  setC(cPar)
  {
    var that = this;
    that.c = (!cPar) ? 0 : (cPar>=(-1) && cPar<=1) ? cPar : null;
  }
  getC() { var that = this; return that.c; }
  setFrac()
  {
    var that = this;
    that.frac = [
      ((1-that.t)*(1+that.b)*(1+that.c))*0.5,
      ((1-that.t)*(1-that.b)*(1-that.c))*0.5,
      ((1-that.t)*(1+that.b)*(1-that.c))*0.5,
      ((1-that.t)*(1-that.b)*(1+that.c))*0.5
    ];
  }
  getFrac(f)
  {
    var that = this;
    if (is(f, 'num') && f>=0 && f<4)
    {
      return that.frac[f];
    }
  }
  setP(pArr)
  {
    var that = this;
    that.p =  (pArr) ?
              pArr :
              [
                {x:(-1/3),  y:(1/8)},
                {x:0,       y:0    },
                {x:(1/3),   y:(1/8)},
                {x:(2/3),   y:(7/8)},
                {x:1,       y:1    },
                {x:(4/3),   y:(7/8)}
              ];
  }
  setD()
  {
    var that = this;
    if (that.p.length > 3)
    {
      that.d = [];
      that.d[0] = null;
      for (var i=1; i<that.p.length-2; i++)
      {
        that.d.push([
          {
            x: that.getFrac(0)*(that.p[i].x-that.p[i-1].x) + that.getFrac(1)*(that.p[i+1].x-that.p[i].x),
            y: that.getFrac(0)*(that.p[i].y-that.p[i-1].y) + that.getFrac(1)*(that.p[i+1].y-that.p[i].y)
          },
          {
            x: that.getFrac(2)*(that.p[i+1].x-that.p[i].x) + that.getFrac(3)*(that.p[i+2].x-that.p[i+1].x),
            y: that.getFrac(2)*(that.p[i+1].y-that.p[i].y) + that.getFrac(3)*(that.p[i+2].y-that.p[i+1].y)
          }
        ]);
      }
    }
  }
  getD(d)
  {
    var that = this;
    if (is(d, 'num') && d > 0 && d < that.p.length-2)
    {
      return that.d[d];
    }
  }
  setH()
  {
    var that = this;
    that.hFnc = [
      function(t) { return (1+2*t)*((1-t)*(1-t)) },
      function(t) { return t*((1-t)*(1-t))       },
      function(t) { return (t*t)*(3-2*t)       },
      function(t) { return (t*t)*(t-1)         }
    ];
  }
  getH(n, t)
  {
    var that = this;
    if (is(n, 'num') && is(t, 'num') && (n >= 0 && n < that.hFnc.length))
    {
      return that.hFnc[n](t);
    }
    return false;
  }
  render()
  {
    var that = this;
    try
    {
      for (var k=1; k<that.p.length-2; k++)
      {
        if (k===1)
        {
          that.ctx.beginPath();
          that.ctx.lineStyle = 'rgb(0,0,0)';
        }
        that.ctx.moveTo(
          that.p[k].x * parseInt(that.cvs.getAttribute('width')),
          (1-that.p[k].y) * parseInt(that.cvs.getAttribute('height'))
        );

        for (var t=0; t<=1; t+=0.1)
        {
          var draw = {
            x:  that.getH(0,t)*that.p[k].x    + that.getH(1,t)*that.getD(k)[0].x +
                that.getH(2,t)*that.p[k+1].x  + that.getH(3,t)*that.getD(k)[1].x,
            y:  that.getH(0,t)*that.p[k].y    + that.getH(1,t)*that.getD(k)[0].y +
                that.getH(2,t)*that.p[k+1].y  + that.getH(3,t)*that.getD(k)[1].y
            /*
            x:  that.getH(0,t)*that.p[k].x    + that.getH(1,t)*(that.p[k+1].x - that.p[k].x)*that.getD(k)[0].x +
                that.getH(2,t)*that.p[k+1].x  + that.getH(3,t)*(that.p[k+1].x - that.p[k].x)*that.getD(k)[1].x,
            y:  that.getH(0,t)*that.p[k].y    + that.getH(1,t)*(that.p[k+1].y - that.p[k].y)*that.getD(k)[0].y +
                that.getH(2,t)*that.p[k+1].y  + that.getH(3,t)*(that.p[k+1].y - that.p[k].y)*that.getD(k)[1].y
                */
          }
          draw.x = draw.x     * parseInt(that.cvs.getAttribute('width'));
          draw.y = (1-draw.y) * parseInt(that.cvs.getAttribute('height'));
          that.ctx.lineTo(draw.x, draw.y);
          //console.log('***');
        }
      }
      that.ctx.stroke();
    } catch (err)
    {
      that.oops(err);
    }
  }
  oops(e) { console.log(['KBSpline Error:', e].join(' ')); }
}
