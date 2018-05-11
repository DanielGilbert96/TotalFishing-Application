// vars
let result = document.querySelector('.result'),
result1 = document.querySelector('.result1'),
img_result = document.querySelector('.img-result'),
img_w = document.querySelector('.img-w'),
img_h = document.querySelector('.img-h'),
options = document.querySelector('.options'),
save = document.querySelector('.save'),
cropped = document.querySelector('.cropped'),
upped = document.querySelector('.upped'),
dwn = document.querySelector('.download'),
recognise = document.querySelector('.recognise'),
upload = document.querySelector('#file-input'),
upload1 = document.querySelector('#file-input1'),
cropper = '';

// on change show image with crop options
upload.addEventListener('change', (e) => {
  if (e.target.files.length) {
		// start file reader
    const reader = new FileReader();
    reader.onload = (e)=> {
      if(e.target.result){
				// create new image
				let img = document.createElement('img');
				img.id = 'image';
				img.src = e.target.result
				// clean result before
				result.innerHTML = '';
				// append new image
        result.appendChild(img);
				// show save btn and options
				save.classList.remove('hide');
				options.classList.remove('hide');
				// init cropper
				cropper = new Cropper(img);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  }
});


// on change show image with crop options
upload1.addEventListener('change', (d) => {
  if (d.target.files.length) {
		// start file reader
    const reader = new FileReader();
    reader.onload = (d)=> {
      if(d.target.result){
				// create new image
				let img = document.createElement('img');
				img.id = 'image';
				img.src = d.target.result
				// clean result before
				result1.innerHTML = '';
				// append new image
        result1.appendChild(img);
      }
    };
    reader.readAsDataURL(d.target.files[0]);
  }
});

// save on click
save.addEventListener('click',(e)=>{
  e.preventDefault();
  // get result to data uri
  let imgSrc = cropper.getCroppedCanvas({
		width: img_w.value // input value
	}).toDataURL();
  // remove hide class of img
  cropped.classList.remove('hide');
	img_result.classList.remove('hide');
	// show image cropped
  cropped.src = imgSrc;
  dwn.classList.remove('hide');
  dwn.download = 'fish'+Math.floor(Math.random() * 928273884) + 3838459+ '.png';
  dwn.setAttribute('href',imgSrc);

});
