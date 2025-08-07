    class Player_Random {
        constructor() {}

        getAction(state) {

            // get the array of legal actions in this state
            let actions = state.getLegalActions();

            // compute a random index of the actions array 
            let randomIndex = Math.floor(Math.random() * actions.length);  

            // return action at that index   
            return actions[randomIndex];
        }
        }
    

    class Player_Greedy {
        constructor() {}
        
        eval(state, player) {

            // get the winner of the current game, will be PLAYER_NONE if no winner yet
            const  winner = state.winner(); 

            // return an eval based on the winner of the game
            if (winner == player) { return 10000;} // win returns large
            else if (winner == (player + 1) % 2) {return -10000;} // return large negative for loss
            else if (winner == PLAYER_DRAW) { return 0;} // return 0 for draw
            else if (winner == PLAYER_NONE) { return 0;} // return 0 for no winner yet
        }

        getAction(state) {
            // get array of legal actions in this state
            let actions = state.getLegalActions();

            // get player whose turn it is to move (if needed)
            let player = state.player;

            // temp vars to store best action and best eval
            let max = -1000000;
            let maxAction = -1;

            // loop through all legal actions
            for (let a = 0; a<actions.length; a++)
            {
                // copy state and do action
                let child = state.copy();
                child.doAction(actions[a]);

                // eval state with respect to player to move
                let value = this.eval(child, player);

                // set new best value and action if this is better
                if (value > max) {
                    max = value;
                    maxAction = actions[a];
                }
            }
        }
    }