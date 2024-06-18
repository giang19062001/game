import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class MainMenu extends Scene {
    logoTween;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.add.image(512, 384, "background");

        this.logo = this.add.image(512, 300, "logo").setDepth(100);

        this.add
            .text(512, 460, "Play game", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setDepth(100)
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerup", () => {
                //đổi scene
                this.scene.start("Game");
            });

        EventBus.emit("current-scene-ready", this);
    }


}

