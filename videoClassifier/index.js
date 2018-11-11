window.addEventListener('DOMContentLoaded', async () => {
  const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
  const videoElem = document.getElementById('video');
  videoElem.srcObject = mediaStream;
  const classifier = ml5.imageClassifier('MobileNet', videoElem, main);
  const ulElem = document.getElementById('results');

  function main() {
    const loading = document.getElementById('loading');
    const contents = document.getElementById('contents');
    loading.classList.add('hidden');
    contents.classList.remove('hidden');
    throttle(classify, 2000);
  }
  function classify() {
    return classifier.predict((err, results) => {
      ulElem.innerHTML = '';
      results.forEach(res => {
        const { className, probability } = res;
        const li = document.createElement('li');
        li.innerText = `${className}: ${probability}`;
        ulElem.appendChild(li);
      });
    });
  }
});


async function throttle(cb, interval) {
  let prevTime = Date.now();
  while (true) {
    const curTime = Date.now();
    const elapsedTime = curTime - prevTime;
    if (elapsedTime > interval) {
      await cb();
      prevTime = Date.now();
    }
  }
}