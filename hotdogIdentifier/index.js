window.addEventListener('DOMContentLoaded', () => {
  const classifier = ml5.imageClassifier('MobileNet', main);
  function main() {
    const loading = document.getElementById('loading');
    const contents = document.getElementById('contents');
    loading.classList.add('hidden');
    contents.classList.remove('hidden');

    const imageHolder = document.getElementById('image-holder');
    imageHolder.addEventListener('drop', onDrop);
    imageHolder.addEventListener('dragover', onDragOver);

    function onDrop(event) {
      event.preventDefault();
      const {
        dataTransfer: {
          items
        }
      } = event;
      const file = items[0].getAsFile();
      const reader = new FileReader();

      reader.addEventListener("load", function () {
        imageHolder.src = reader.result;
        onImageLoaded();
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
    }

    function onDragOver(event) {
      event.preventDefault();
    }
    
    function onImageLoaded() {
      const resultElement = document.getElementById('result');
      resultElement.innerHTML = '';

      classifier.predict(imageHolder, (err, results) => {
        const isHotdog = results.reduce((predicate, item) => {
          const hasHot = item.className.includes('hot');
          const hasDog = item.className.includes('dog');
          const hasHotDog = hasHot && hasDog;
          return hasHotDog || predicate;
        }, false);
        if (isHotdog) {
          resultElement.innerHTML = "It's a hotdog";
        } else {
          resultElement.innerHTML = "It's not a hotdog";
        }
      });

    }

  }
});
