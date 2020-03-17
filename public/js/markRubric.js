class markRubric {
  // Marks should be an array with the following:
  // Max, A, B, C, D, E
  constructor(name, marks) {
    this.name = name;
    this.marks = marks;

  }
  calculateCurves() {
    let maxMark = this.marks[0];
    let curves = [];
    for (let mark of this.marks.slice(1)) {
      curves.push(mark / maxMark);
    }
    this.curves = curves;
  }
  getNewValues(maxMark) {
    let newMarks = [];
    for (let curve of this.curves) {
      newMarks.push(Math.round(maxMark * curve));
    }
    return newMarks
  }
}
