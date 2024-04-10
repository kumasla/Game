//CharacterController - 오직 캐릭터의 움직임에 한해서만 정의함


class CharacterController {
    constructor(scene, selectedCharacterName){
        this.scene = scene;
        this.slidePossible = true;
        this.nowSliding = false;

        this.selectedCharacterName = selectedCharacterName;

        this.characterStatus = new CharacterStatus(this.scene, this.getCharacterInfo(selectedCharacterName))

        this.player = this.createCharacter(this.getCharacterInfo(selectedCharacterName));

        this.scene.physics.add.existing(this.player);
        this.player.setScale(this.getCharacterInfo(selectedCharacterName).scale)
        this.player.setDepth(1);

        this.keyboardInput = this.scene.input.keyboard.createCursorKeys();

    }

    update(){
        //방향키에 따른 움직임
        if(!this.nowSliding){
            this.move(this.player);
        }
        
        //슬라이드 => 회피율 100 속도는 설정 가능
        if(this.slidePossible && !this.nowSliding){
            this.slide(this.player);
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
        });

        this.scene.anims.create({
            key : "slide",
            frames : this.scene.anims.generateFrameNumbers(characterData.spriteKey,
                {start : characterData.animations.slide.frames.start, end : characterData.animations.slide.frames.end}),
            frameRate : characterData.animations.slide.frameRate,
            repeat : characterData.animations.slide.repeat
        });

        const player = this.scene.physics.add.sprite(0, 0, characterData.spriteKey);
        return player;
    }

    //움직임
    move(player){
        if (this.keyboardInput.left.isDown || this.keyboardInput.right.isDown || this.keyboardInput.up.isDown || this.keyboardInput.down.isDown) {
            if (!this.nowSliding) { // 슬라이드 상태가 아닐 때만 move 애니메이션 실행
                player.anims.play("move", true);
            }
        }else{
            if (!this.nowSliding) { // 슬라이드 상태가 아닐 때만 stop 애니메이션 실행
                player.anims.play("stop", true);
            }
        }
    
        if(this.keyboardInput.left.isDown){
            player.setVelocityX(-this.characterStatus.speed); //= 이동할때
            player.flipX = true;
        } else if(this.keyboardInput.right.isDown){
            player.setVelocityX(this.characterStatus.speed);
            player.flipX = false;
        } else {
            player.setVelocityX(0);
        }
    
        if(this.keyboardInput.up.isDown){
            player.setVelocityY(-this.characterStatus.speed);
        } else if(this.keyboardInput.down.isDown) {
            player.setVelocityY(this.characterStatus.speed);
        } else {
            player.setVelocityY(0);
        }
    }
    
    //슬라이드
    slide(player){
        let beforeAvoidance = this.characterStatus.avoidance;
        let beforeSpeed = this.characterStatus.speed;

        if(this.keyboardInput.space.isDown){
            //회피율 / 슬라이드 속도
            this.characterStatus.sliding(100, 7000);

            //이게 없으면 속도변화가 없음
            if(this.keyboardInput.left.isDown){
                player.setVelocityX(-this.characterStatus.speed);
            } else if(this.keyboardInput.right.isDown){
                player.setVelocityX(this.characterStatus.speed);
            } else {
                player.setVelocityX(0);
            }
        
            if(this.keyboardInput.up.isDown){
                player.setVelocityY(-this.characterStatus.speed);
            } else if(this.keyboardInput.down.isDown) {
                player.setVelocityY(this.characterStatus.speed);
            } else {
                player.setVelocityY(0);
            }

            this.slidePossible = false;
            this.nowSliding = true;
            
            this.player.anims.play('slide', true);

            //bind를 사용하지 않고 그냥 setTimeout을 작성하면 this가 window를 가르킨다
            //따라서 bind로 지정해줘야 한다

            setTimeout(function(){
                this.nowSliding = false; // 슬라이드 상태 해제
                this.characterStatus.sliding(beforeAvoidance, beforeSpeed);
            }.bind(this),200);


            setTimeout(function(){
                this.slidePossible = true;
            }.bind(this),this.selectedCharacterName == 'sonic' ? 3500 : 5000);

        }
    }
}