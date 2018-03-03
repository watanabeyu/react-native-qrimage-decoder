const htmlString = `<!doctype html>
<html>

<head>
  <meta charset="UTF-8">
  <script src="https://cdn.jsdelivr.net/npm/jsqr@1.0.4/dist/jsQR.min.js"></script>
  <script>
    var w = 700;

    function readBySrc(src) {
      document.body.innerHTML = "";
      var canvas = document.createElement("canvas");
      document.body.appendChild(canvas)

      var ctx = canvas.getContext('2d');

      var img = new Image();
      img.src = src;

      img.onload = function () {
        if (img.width > w || img.height > w) {
          if (img.width > img.height) {
            canvas.width = w;
            canvas.height = (w * img.height) / img.width;
          } else if (img.width < img.height) {
            canvas.width = (w * img.width) / img.height;
            canvas.height = w;
          } else {
            canvas.width = w;
            canvas.height = w;
          }
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var res = jsQR(data.data, canvas.width, canvas.height);

        if (res) {
          window.postMessage(JSON.stringify({
            error: false,
            message: res.data,
            src: src
          }))
        } else {
          window.postMessage(JSON.stringify({
            error: true,
            message: "error decoding QR Code",
            src: src
          }))
        }
      }

      img.onerror = function () {
        window.postMessage(JSON.stringify({
          error: true,
          message: "Failed to load the image",
          src: src
        }))
      }
    }
  </script>
</head>

<body></body>

</html>`;

export default htmlString;