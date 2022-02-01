import Arc from "./Arc.js";
export default class ArcList {
    constructor(arc) {
        this.list = [arc];
        this.complexity = 0;
    }
    draw() {
        for (let arc of this.list) {
            arc.draw();
        }
    }
    intersect(arcList) {
        this.complexity++;
        if (arcList.list.length == 0) {
            this.list = [];
            return;
        }
        if (arcList.list.length == 1 && this.list.length == 1) {
            this.list[0].end = this.list[0].upperIntersection(arcList.list[0]);
            this.list[0].start = this.list[0].lowerIntersection(arcList.list[0]);
            if (this.list[0].end != 7) {
                this.list.push(arcList.list[0])
                this.list[1].start = this.list[1].upperIntersection(this.list[0]);
                this.list[1].end = this.list[1].lowerIntersection(this.list[0]);
            }
            else {
                this.list = [];
            }
            return;
        }
        let upperNotFound = true;
        let leftIndex = 0;
        let rightIndex = arcList.list.length - 1
        let leftAngle = 0;
        let rightAngle = 0;
        while (upperNotFound) {
            let leftArc = this.list[leftIndex];
            let rightArc = arcList.list[rightIndex];
            leftAngle = leftArc.upperIntersection(rightArc);
            if (leftAngle == -7) {
                this.list = [];
                return;
            }
            if (leftAngle < leftArc.start || leftAngle > leftArc.end) {
                leftIndex++;
                continue;
            }
            rightAngle = rightArc.upperIntersection(leftArc);
            if (rightAngle == -7) {
                this.list = [];
                return;
            }
            if (rightAngle < rightArc.start || rightAngle > rightArc.end) {
                rightIndex--;
                continue;
            }
            upperNotFound = false;
        }
        let upperIntersects = [leftIndex, rightIndex];
        let upperAngles = [leftAngle, rightAngle];
        let lowerNotFound = true;
        leftIndex = this.list.length;
        rightIndex = arcList.list.length - 1;
        while (lowerNotFound && leftIndex > 0 && rightIndex < 2 * arcList.list.length) {
            let leftArc = this.list[leftIndex % this.list.length];
            let rightArc = arcList.list[rightIndex % arcList.list.length];
            leftAngle = leftArc.lowerIntersection(rightArc);
            if (leftAngle == -7) {
                this.list = [];
                return;
            }
            if (leftAngle < leftArc.start || leftAngle > leftArc.end) {
                leftIndex--;
                continue;
            }
            rightAngle = rightArc.lowerIntersection(leftArc);
            if (rightAngle == -7) {
                this.list = [];
                return;
            }
            if (rightAngle < rightArc.start || rightAngle > rightArc.end) {
                rightIndex++;
                continue;
            }
            lowerNotFound = false;
        }
        leftIndex = leftIndex % this.list.length;
        rightIndex = rightIndex % arcList.list.length;
        let lowerIntersects = [leftIndex, rightIndex];
        let lowerAngles = [leftAngle, rightAngle];
        this.list[upperIntersects[0]].end = upperAngles[0];
        this.list[lowerIntersects[0]].start = lowerAngles[0];
        arcList.list[upperIntersects[1]].end = upperAngles[1];
        arcList.list[lowerIntersects[1]].start = lowerAngles[1];

    }
    /**
     * Adds another arc to the list
     * @param {Arc} arc 
     * @returns nothing
     */
    addArc(arc) {
        //the initial addition
        if (this.list.length == 1) {
            let intersections = this.list[0].intersections(arc);
            if (intersections.length == 2) {
                this.list.push(arc);
                let opposingIntersections = this.list[1].intersections(this.list[0]);
                this.list[1].start = opposingIntersections[0]
                this.list[1].end = opposingIntersections[1];
                this.list[0].start = intersections[0];
                this.list[0].end = intersections[1];
            }
            else if (intersections.length = 1)
            {
                this.list[0].start = intersections[0];
                this.list[0].end = intersections[0]+0.00001;
            }
            else {
                this.list = [];
            }
            return;
        }
        let insertionStart = -1;
        let insertionEnd = -1;
        let i = 0;
        for (let listArc of this.list)
        {
            let intersections = listArc.intersections(arc);
            if (intersections[0] <= listArc.end && intersections[0] >= listArc.start)
            {
                listArc.start = intersections[0];
                arc.end = arc.intersections(listArc)[1];
                insertionEnd = i;
            }
            if (intersections[1] <= listArc.end && intersections[1] >= listArc.start)
            {
                listArc.end = intersections[1];
                arc.start = arc.intersections(listArc)[0];
                insertionStart = i;
            }
            i++;
        }
        if (insertionStart == -1)
        {
            this.list = [];
            return;
        }
        if (insertionStart+1 > insertionEnd)
        {
            this.list.splice(insertionStart+1, insertionEnd-insertionStart);
        }
        else if (insertionEnd > insertionStart)
        {
            this.list.splice(insertionStart+1, this.list.length-insertionStart-1);
            this.list.splice(0,insertionEnd);
        }
        this.list.splice(insertionStart+1, 0, arc);
        
    }
}