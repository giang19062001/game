import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
    constructor() {
        super("Game");
    }

    preload() {
        this.add.image(512, 384, "background").setAlpha(0.5);
        this.add
            .text(65, 740, "Quay về", {
                fontFamily: "Arial Black",
                fontSize: 20,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100)
            .setInteractive()
            .on("pointerup", () => {
                //đổi scene
                this.scene.start("MainMenu");
            });
        this.load.image("ground", "assets/ground.jpg");
        this.load.image("star", "assets/star.png");
        this.load.image("bomb", "assets/bomb.png").sets;

        // this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.atlas(
            "dude",
            "assets/dute_spritesheet.png",
            "assets/dute_sprites.json"
        );

        EventBus.emit("current-scene-ready", this);
    }

    createBomb() {
             let x = this.sys.game.config.width; // Vị trí ngẫu nhiên theo trục x từ 100 đến 700
            let y = 650; // Đặt vị trí y để bom xuất hiện ngay trên mặt đất
            let bomb = this.bombs.create(x, y, 'bomb');
            bomb.setScale(0.2); // Đặt kích thước của quả bom
            bomb.setVelocityX(-200); // Đặt boom luôn di chuyển về nhân vật
    }
    create() {
        var score = 0;
        var scoreText;
        scoreText = this.add.text(16, 16, "score: 0", {
            fontSize: "32px",
            fill: "#000",
        });

        const platforms = this.physics.add.staticGroup();
        platforms.create(500, 725, "ground").setScale(1.2, 1).refreshBody();
        this.player = this.physics.add.sprite(50, 600, "dude"); // vị trí nhân vật xuất hiện đầu tiên
        // Đặt vị trí ban đầu của nhân vật

        this.player.setScale(0.4); // giảm kích thước nhân vật xíu
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platforms); // cho nhân vật đứng trên đất

        // Tạo các hoạt ảnh cho nhân vật
        this.anims.create({
            key: "left",
            frames: [
                { key: "dude", frame: "run1" },
                { key: "dude", frame: "run2" },
                { key: "dude", frame: "run3" },
            ],
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [
                { key: "dude", frame: "stand1" },
                { key: "dude", frame: "stand2" },
                { key: "dude", frame: "stand3" },
            ],
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "right",
            frames: [
                { key: "dude", frame: "run1" },
                { key: "dude", frame: "run2" },
                { key: "dude", frame: "run3" },
            ],
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "jump",
            frames: [{ key: "dude", frame: "jump1" }],
            frameRate: 10,
            repeat: -1,
        });


        // Tạo các phím điều khiển
        this.cursors = this.input.keyboard.createCursorKeys();

        //tạo sao thu thập
        this.stars = this.physics.add.group({
            key: "star",
            repeat: 5,
            setXY: { x: 200, y: 650, stepX: 100 }, //stepX có nghĩa là star về sau có x: 200, 300, 400 ,n ... vô hạn tới hết 5
        });
        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            // generate độ nảy của các ngôi sao khi chạm đất từ  random 0.4 => 0.8
        });

         //tạo boom
         this.bombs = this.physics.add.group();
         this.createBomb() // tạo bomb
         this.physics.add.collider(this.bombs, platforms); // cho boom trên mặt đất
 
         function hitBomb(player, bomb) {
             this.physics.pause();
             this.scene.start("GameOver");
         }
 
         this.physics.add.collider(this.player, this.bombs, hitBomb, null, this); //gọi hàm khi người dùng đụng trúng boom

        function collectStar(player, star) {
            star.disableBody(true, true); // ẩn star đụng trúng
            score += 10;
            scoreText.setText("Score: " + score); // cập nhập lai điểm
        }
        //xem player có đụng trúng star ko
        this.physics.add.overlap(
            this.player,
            this.stars,
            collectStar,
            null,
            this
        );
        this.physics.add.collider(this.stars, platforms); // cho ngôi sao nằm trên đất

       
    }
    update() {

        // Điều khiển nhân vật di chuyển
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-100);
            this.player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(100);
            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play("turn");
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-300);
            this.player.anims.play("jump");
        }

        this.bombs.children.iterate(bomb => {
            if (bomb.x < 0) { // Nếu quả bom ra khỏi biên giới dưới màn hình
                bomb.destroy(); // Hủy bỏ quả bom hiện tại
                this.createBomb(); // Tạo lại quả bom mới
            }
        });
    }
}

