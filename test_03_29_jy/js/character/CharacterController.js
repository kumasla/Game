//CharacterController - 오직 캐릭터의 움직임에 한해서만 정의함


class CharacterController {
    constructor(scene, selectedCharacterName){
        this.scene = scene;
        this.slidePossible = true;

        this.character = new Character(this.scene, this.getCharacterInfo(selectedCharacterName))

        this.playerAnimation = this.createCharacter(this.getCharacterInfo(selectedCharacterName));

        this.scene.physics.add.existing(this.playerAnimation);
        this.playerAnimation.setScale(this.getCharacterInfo(selectedCharacterName).scale)
        this.playerAnimation.setDepth(1);

        this.slidePossible = true;
        this.keyboardInput = this.scene.input.keyboard.createCursorKeys();

    }

    update(){
        this.move(this.playerAnimation);
    
        if(this.slidePossible){
            this.slide(this.playerAnimation);
        }
    }
    
    //캐릭터 선택에 따른 캐릭터 정보 반환
    getCharacterInfo(selectedCharacterName){
        const characterData = this.scene.cache.json.get('characterData'); // preload에 있는 json 데이터를 가지고 옴
        return characterData[selectedCharacterName];
    }

    createCharacter(characterData){
        this.scene.anims.create({
            key : "move",
            frames : this.scene.anims.generateFrameNumbers(characterData.spriteKey,
                {start : characterData.animations.move.frames.start, end : characterData.animations.move.frames.end}),
            frameRate : characterData.animations.move.frameRate,
            repeat : characterData.animations.move.repeat
        });

        this.scene.anims.create({
            key : "stop",
            frames : this.scene.anims.generateFrameNumbers(characterData.spriteKey,
                {start : characterData.animations.stop.frames.start, end : characterData.animations.stop.frames.end}),
            frameRate : characterData.animations.stop.frameRate,
            repeat : characterData.animations.stop.repeat
        })

        /* this.scene.anims.create({
            key : "slide",
            frames : this.scene.anims.generateFrameNumbers(characterData.spriteKey,
                {})
        }) */

        const player = this.scene.physics.add.sprite(0, 0, characterData.spriteKey);
        return player;
    }

    //움직임
    move(player){
        if (this.keyboardInput.left.isDown || this.keyboardInput.right.isDown || this.keyboardInput.up.isDown || this.keyboardInput.down.isDown) {
            player.anims.play("move", true);
        }else{
            player.anims.play("stop", true);
        }
    
        if(this.keyboardInput.left.isDown){
            player.setVelocityX(-this.character.speed); //= 이동할때
            player.flipX = true;
            //this.background.tilePositionX -= this.speed;
        } else if(this.keyboardInput.right.isDown){
            player.setVelocityX(this.character.speed);
            player.flipX = false;
            //this.background.tilePositionX += this.speed;
        } else {
            player.setVelocityX(0);
        }
    
        if(this.keyboardInput.up.isDown){
            player.setVelocityY(-this.character.speed);
            //this.background.tilePositionY -= this.speed;
        } else if(this.keyboardInput.down.isDown) {
            player.setVelocityY(this.character.speed);
            //this.background.tilePositionY += this.speed;
        } else {
            player.setVelocityY(0);
        }
    }
    
    //슬라이드
    slide(player){
        let moving = false;
        let beforeAvoidance = player.avoidance;
        let beforeSpeed = player.speed;

        if(this.keyboardInput.space.isDown){
            player.avoidance(100);
            player.speed(1000);
            player.anims.play('slide', true);
            moving = true;
            this.slidePossible = false;
            //console.log(player);

            //bind를 사용하지 않고 그냥 setTimeout을 작성하면 this가 window를 가르킨다
            //따라서 bind로 지정해줘야 한다

            setTimeout(function(){
                player.avoidance(beforeAvoidance);
                player.speed(beforeSpeed);
            }.bind(this),120);

            if(player != 'sonic'){
                setTimeout(function(){
                    this.slidePossible = true;
                }.bind(this),5000);
            }else{
                setTimeout(function(){
                    this.slidePossible = true;
                }.bind(this),4000);
            }
        }
    }
}



//this.player = new CharacterController(selectedCharacterName);