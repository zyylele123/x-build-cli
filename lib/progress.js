const progress = {
  getProgress() {
    return `[${this.progressCurrent}/${this.progress}] `;
  }
};

module.exports = progress;