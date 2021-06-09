getFileToUpload = (photoStyles, withOutSave, withoutSaveProject) => {
  const { correctionFactor } = this.state;

  const {
    frame,
    [this.optionsKey]: { selectedMatting, selectedOption },
    changePhotoStatus,
    updateProject,
    projectId,
  } = this.props;
  const {
    naturalWidth,
    naturalHeight,
  } = this.imageToUpload;

  const { frameSize: { width: photoFrameWidth, height: photoFrameHeight } } = selectedOption;

  const {
    framePhotoArtMatting,
  } = frame;

  const { clientWidth: wrapWidth, clientHeight: wrapHeight } = this.photoWrap;

  const { paddingVertical, paddingHorizontal } = framePhotoArtMatting || {};
  const { value: matValue } = selectedMatting || {};
  const {
    width,
    height,
    top,
    left,
  } = photoStyles;

  const matOffsetLeft = matValue ? wrapWidth * Number(paddingHorizontal) / HUNDRED : 0;
  const matOffsetTop = matValue ? wrapHeight * Number(paddingVertical) / HUNDRED : 0;
  const x = matOffsetLeft - left * correctionFactor;
  const y = matOffsetTop - top * correctionFactor;
  const scaleX = naturalWidth / (width * correctionFactor);
  const scaleY = naturalHeight / (height * correctionFactor);

  const cropNaturalWidth = (wrapWidth - matOffsetLeft * 2) * scaleX;
  const cropNaturalHeight = (wrapHeight - matOffsetTop * 2) * scaleY;
  this.canvas.width = cropNaturalWidth;
  this.canvas.height = cropNaturalHeight;
  const ctx = this.canvas.getContext('2d');

  const isGoodPhoto = checkQuality(
    cropNaturalHeight,
    cropNaturalWidth,
    photoFrameHeight,
    photoFrameWidth,
  );

  ctx.drawImage(
    this.imageToUpload,
    x * scaleX,
    y * scaleY,
    cropNaturalWidth,
    cropNaturalHeight,
    0,
    0,
    cropNaturalWidth,
    cropNaturalHeight,
  );

  if (!withOutSave) {
    this.photoToPreview = this.canvas.toDataURL(IMAGE_TYPE_JPEG);
    this.dataURLtoFile(this.photoToPreview);
    if (projectId && !withoutSaveProject) {
      updateProject();
    }
  }
  changePhotoStatus(isGoodPhoto);
};