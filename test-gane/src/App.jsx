import { useRef, useState } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './game/PhaserGame';

function App ()
{
    
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();


    // Event emitted from the PhaserGame component
    const currentScene = (scene) => {
        
    }

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            {/* <div> */}
                {/* <div>
                    <button className="button" onClick={changeScene}>Change Scene</button>
                </div> */}
                {/* <div>
                    <button disabled={canMoveSprite} className="button" onClick={moveSprite}>Toggle Movement</button>
                </div>
                <div className="spritePosition">Sprite Position:
                    <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
                </div>
                <div>
                    <button className="button" onClick={addSprite}>Add New Sprite</button>
                </div> */}
            {/* </div> */}
        </div>
    )
}

export default App
