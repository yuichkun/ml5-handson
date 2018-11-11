window.addEventListener('DOMContentLoaded', async () => {
  const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
  const videoElem = document.getElementById('video');
  const status = document.getElementById('status');
  const faceContainer = document.getElementById('face-container');
  videoElem.srcObject = mediaStream;

  const featureExtractor = ml5.featureExtractor('MobileNet', null);
  const classifier = featureExtractor.classification(videoElem, main);

  function main() {
    const loading = document.getElementById('loading');
    const contents = document.getElementById('contents');
    loading.classList.add('hidden');
    contents.classList.remove('hidden');

    addListeners();
  }
  function addListeners() {
    const LEARNING = 'learning';
    const smileButton = document.getElementById('smile');
    const cryButton = document.getElementById('cry');
    const goButton = document.getElementById('go');
    const feedCounts = {
      smile: 0,
      cry: 0
    };
    let feeding = null;

    smileButton.onclick = () => {
      if (cryButton.classList.contains(LEARNING)) {
        cryButton.classList.remove(LEARNING);
      }
      if (smileButton.classList.contains(LEARNING)) {
        clear();
      } else {
        feedImage('smile');
      }
      smileButton.classList.toggle(LEARNING);
    };

    cryButton.onclick = () => {
      if (smileButton.classList.contains(LEARNING)) {
        smileButton.classList.remove(LEARNING);
      }
      if (cryButton.classList.contains(LEARNING)) {
        clear();
      } else {
        feedImage('cry');
      }
      cryButton.classList.toggle(LEARNING);
    };

    goButton.onclick = async () => {
      if (feeding) {
        clearAll();
      }
      await classifier.train(loss => {
        if (loss) {
          status.innerText = `loss is ${loss}`;
        }
      });
      classifier.classify(onClassified);
      function onClassified(err, result) {
        classifier.classify(onClassified);
        status.innerText = `Predicting: ${result}`;
        if (result === 'smile') {
          faceContainer.innerText = '😊';
        } else {
          faceContainer.innerText = '😭';
        }
      }
    };

    function feedImage(label) {
      if (feeding) {
        clearInterval(feeding);
      }
      feeding = setInterval(() => {
        status.innerText = `Feeding for ${label}: Feeded ${feedCounts[label]} images`;
        feedCounts[label]++;
        classifier.addImage(label);
      }, 100);
    }
    function clearAll() {
      clear();
      smileButton.classList.remove(LEARNING);
      cryButton.classList.remove(LEARNING);
    }
    function clear() {
      clearInterval(feeding);
      status.innerText = '';
    }
  }

});