
const width = window.innerWidth;
const height = window.innerHeight;
const config = {
    type:Phaser.AUTO,
    width:width,
    height:height,
    physics: { // 물리엔진
        default: 'arcade',
        arcade: {
            //debug:true, //디버깅 사용
        }
    },
    scale:{
        mode: Phaser.Scale.FIT, // 자동맞춤
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width:width,
        height:height,
    },
    

    // 장면 설정
    scene:[Loading, MainMenu, CharacterSelect, StageSuperMario, EndingScene, ItemSelectionScene, PauseMenu, ExitConfirmation]
}

const game = new Phaser.Game(config);