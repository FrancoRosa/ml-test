var video = document.querySelector("#video");
var canvas = document.querySelector("#canvas");

const drawRect = (detections, ctx) => {
  // Loop through each prediction
  ctx.clearRect(0, 0, 640, 480);
  detections.forEach((prediction) => {
    // Extract boxes and classes
    const {
      bbox: { x, y, width, height },
      class: text,
      confidence,
      color,
    } = prediction;
    const acc = Math.round(confidence * 100);
    ctx.strokeStyle = color;
    ctx.font = "2em Monospace";

    // Draw rectangles and text
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillText(`${text} ${acc}% ${width.toFixed(1)}`, x + 5, y + 24);
    ctx.lineWidth = 5;
    ctx.rect(x - width / 2, y - height / 2, width, height);
    ctx.stroke();
  });
};

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: { width: 640, height: 480 } })
    .then(function (stream) {
      video.srcObject = stream;
      roboflow
        .auth({
          publishable_key: "rf_5w20VzQObTXjJhTjq6kad9ubrm33",
        })
        .load({
          model: "trees-88tmr",
          version: 3,
        })
        .then(function (model) {
          setInterval(() => {
            model.detect(video).then(function (predictions) {
              const ctx = canvas.getContext("2d");
              drawRect(predictions, ctx);
            });
          }, 250);
        });
      //   roboflow
      //     .auth({
      //       publishable_key: "rf_5w20VzQObTXjJhTjq6kad9ubrm33",
      //     })
      //     .load({
      //       model: "ppe-detection-exbpw",
      //       version: 3,
      //     })
      //     .then(function (model) {
      //       setInterval(() => {
      //         model.detect(video).then(function (predictions) {
      //           const ctx = canvas.getContext("2d");
      //           drawRect(predictions, ctx);
      //         });
      //       }, 250);
      //     });
    })
    .catch(function (error) {
      console.error(error);
      console.log("Something went wrong!");
    });
}
