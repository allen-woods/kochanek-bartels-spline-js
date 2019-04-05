document.addEventListener('DOMContentLoaded', function() {
  let testCanvas = document.createElement('canvas')
  document.body.appendChild(testCanvas)
  testCanvas.setAttribute('id', 'canvas')
  testCanvas.setAttribute('width', `${window.innerWidth}`)
  testCanvas.setAttribute('height', `${window.innerHeight}`)
  let testContext = document.getElementById('canvas').getContext('2d')

  let seedKnots = []
  for (let seedNum = 0; seedNum < 10; seedNum++) {
    seedKnots.push(
      new TensionVector(
        Math.floor(Math.random() * window.innerWidth),
        Math.floor(Math.random() * window.innerHeight),
        Math.floor(Math.random() * window.innerWidth),
        0,
        0,
        0
      )
    )
  }

  let testCurve = new Spline3d(seedKnots)
  testCurve.drawCurve(testContext)
})