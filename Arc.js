export default class Arc {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.start = 0;
        this.end = 2 * PI;
    }
    draw() {
        if (this.start == -7 || this.end == -7) {
            return;
        }
        stroke(0);
        noFill();
        arc(this.x, this.y, 2*this.radius, 2*this.radius, this.start, this.end);
    }
    /**
     * Finds the upper intersection between the two circles of the arc
     * @param {Arc} arc 
     * 
     * @returns the angle for this circle that the intersection is at
     */
    upperIntersection(arc) {
        let dist = Math.hypot(this.x - arc.x, this.y - arc.y);
        let theta = acos(dist/2/ this.radius);
        if (dist > 2 * this.radius) {
            return -7; //(bad angle)
        }
        if (arc.x > this.x) {

            let alpha = Math.asin((arc.y - this.y) / dist);
            if (dist == 2 * this.radius) {
                return alpha;
            }
            return theta + alpha;
        }
        else {
            let alpha = PI - Math.asin((arc.y - this.y) / dist);
            if (dist == 2 * this.radius) {
                return alpha;
            }
            return alpha - theta;
        }
        return 0;
    }
    lowerIntersection(arc) {
        let dist = Math.hypot(this.x - arc.x, this.y - arc.y);
        let theta = acos(dist/ 2/ this.radius);
        if (dist > 2 * this.radius) {
            return -7; //(bad angle)
        }
        if (arc.x > this.x) {

            let alpha = Math.asin((arc.y - this.y) / dist);
            if (dist == 2 * this.radius) {
                return alpha;
            }
            return alpha - theta;
        }
        else {
            let alpha = PI -Math.asin((arc.y - this.y) / dist);
            if (dist == 2 * this.radius) {
                return alpha;
            }
            return alpha + theta;
        }
        return 0;
    }
    intersections(arc) {
        let dist = Math.hypot(this.x - arc.x, this.y - arc.y);
        let alpha = Math.asin((arc.y-this.y)/dist);
        if (dist == 2 * this.radius)
        {
            return [alpha]
        }
        let theta = acos(dist/2/this.radius);
        if (arc.x < this.x)
        {
            return [PI - alpha-theta, PI - alpha + theta];
        }
        return[alpha-theta, alpha+theta];
    }
}