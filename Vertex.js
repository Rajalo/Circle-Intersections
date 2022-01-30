export default class Vertex {
    /**
     * Constructs an selected Vertex
     */
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.selected = true;
    }
    /**
     * Draws the vertex on screen 
     */
    draw(){
        stroke(0);
        if (this.selected)
        {
            fill('rgba(255,0,0, 0.25)');
        }
        else
        {
            fill(10);
        }
        ellipse(this.x,this.y,10,10);
    }
    /**
     * Unselects the vertex
     */
    unselect()
    {
        this.selected = false;
    }
    /**
     * Unselects the vertex
     */
    select()
    {
        this.selected = true;
    }
    distance(x,y)
    {
        return Math.hypot(this.x-x,this.y-y);
    }
}