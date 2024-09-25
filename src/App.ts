/* Lecture 8
 * CS 4388/ CS 5388, Fall 2024, Texas State University
 * Instructor: Isayas Berhe Adhanom <isayas@txstate.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'

export class App extends gfx.GfxApp
{
    private ground: gfx.Mesh3;
    private skybox: gfx.Mesh3;
    private sphere: gfx.Mesh3;

    private sphereVelocity: gfx.Vector3;

    private sphereRadius: number;
    // --- Create the App class ----
    constructor()
    {
        // initialize the base class gfx.GfxApp
        super();

        this.ground = gfx.Geometry3Factory.createBox(50,1,50);
        this.skybox = gfx.Geometry3Factory.createBox(100,100,100);
        this.sphere = gfx.Geometry3Factory.createSphere();

        this.sphereVelocity = new gfx.Vector3();
        this.sphereRadius = 1;
    }


    // --- Initialize the graphics scene ---
    createScene(): void 
    {
        this.camera.setPerspectiveCamera(60, 1920/1080, 0.1, 100);
        this.camera.position.set(0,1.6,0);

        this.ground.position.set(0,-0.5,0);
        this.ground.material.setColor(new gfx.Color(83/255, 209/255, 110/255));

        //create ambient light to add uniform and constant lighting to everything in the scene
        const ambientLight = new gfx.AmbientLight(new gfx.Color(0.4,0.4,0.4));

        //create directional light that is infinitely far away like sunlight
        const directionalLight = new gfx.DirectionalLight(new gfx.Color(0.6,0.6,0.6));
        directionalLight.position.set(1,2,1);

        this.skybox.material = new gfx.UnlitMaterial();
        this.skybox.material.side = gfx.Side.BACK;
        this.skybox.material.setColor(new gfx.Color(0.698,1,1));
        

        this.sphere.position.set(0,1,-10);
        this.sphereVelocity.set(0,7,0);
        

        this.scene.add(this.ground);
        this.scene.add(ambientLight);
        this.scene.add(this.skybox);
        this.scene.add(this.sphere);
        this.scene.add(directionalLight);
        

    }

    
    // --- Update is called once each frame by the main graphics loop ---
    update(deltaTime: number): void 
    {
        //set accelaration constant
        const spehereAccelaration = new gfx.Vector3(0,-3,0);   // accelarion in m/sec/sec

        //v_new = v_old + a*dt

        const a_dt = gfx.Vector3.multiplyScalar(spehereAccelaration, deltaTime);

        this.sphereVelocity.add(a_dt);

        //p_new = p_old + v_new*dt

        const v_dt = gfx.Vector3.multiplyScalar(this.sphereVelocity, deltaTime);

        this.sphere.position.add(v_dt);

        if (this.sphere.position.y - this.sphereRadius < 0){
            
            //collision position correction
            this.sphere.position.y = this.sphereRadius;

            //reflected velocity
            this.sphereVelocity.y *= -1.0;

            //slow down the bounce to take friction into consideration
            const frictionSlowDown = 0.85;
            this.sphereVelocity.multiplyScalar(frictionSlowDown);

            //debug sphere's position to determine if and where collision was detected
            console.log("collision detected: ", this.sphere.position.y);

            //Pause simulation to check detected collision.
            //this.pause()
        }

    }
}