class Player_User {
    constructor(config) {
        this.config = config; // this.config.limit = maximum time limit for user input = 0 no time limit
                              // this.config.maxDepth = maximum depth for user input = 0 no limit

        this.searchStartTime = 0; // time when search started

        // Iterative Deepening ALpha-Beta Search settings
        this.bestAction = null; // best action found so far
        this.currentBestAction = null; // current best action
        this.currentMaxDepth = null; // current max depth of search
        this.maxPlayer = null; // mcurrent maximizing player   for minimax

        let str = "AI\n";

        str += " Time Limit: " + this.config.limit + " \n";
        str += " Max Depth: " + this.config.maxDepth + " \n";
        console.log(str);

        //create Zobrist random value tables here for optimization
    }

    getAction(state) {
        console.log("AI is thinking...");
        return this.IDAlphaBeta(state);
    }

    // here we implement the Iterative Deepening Alpha-Beta Search
    // we use this.config.limit to limit the time of the search
    // and this.config.maxDepth to limit the depth of the search
    // one will always be greater than 0
    // return best completed action from last completed search
    // ARgs: state - state to find the best action for player to move
    // returns: best action for player to move
    IDAlphaBeta(state) {
        // record of time
        this.searchStartTime = performance.now();

        this.bestAction = null;
        this.maxPlayer = state.player;
        for ( let depth = 1; depth < this.config.maxDepth; depth++) 
        {
            this.currentMaxDepth = depth;
            try
            {
                this.MiniMax(state, 0, true);
                //this.AlphaBeta(state, -Infinity, Infinity, 0, true);
                this.bestAction = this.currentBestAction;
            } catch (TimeoutException) {
                break; // exit the loop on timeout
            }
        }
        // return best action 
        return this.bestAction;
    }

    // Helper function to get children and execute action
    children(state) {
        let actions = state.getLegalActions();
        let children = [];
        for (let a of actions) {
            let child = state.copy();
            child.doAction(a);
            children.push( {child:child, action:a} );
        }
        return children;
    }

    // Helper function to check terminal state
    terminal(state) {
        return state.winner() != PLAYER_NONE;
    }

    // here we implement minmax without alha-beta pruning
    // make sure to copy states via state.copy() before generating children othewise modification of references of state will occur on different levels of recursion
    // ARgs:
    // state - state of current node of search tree
    // depth(int) : current depth of search
    // max(bool) : whether the player is maximizing or not
    MiniMax(state, depth, max) {
        // check if last node
        if (this.terminal(state) || depth == this.currentMaxDepth) { return this.eval(state, this.maxPlayer); }
        // perform time check
        let elapsedTime = performance.now() - this.searchStartTime;
        if (this.config.limit > 0 && elapsedTime > this.config.limit) { throw new TimeoutException(); }
        if (max) {
            let maxEval = -Infinity;
            for ( let child of this.children(state)) {
                let evalPrime = this.MiniMax(child.child, depth + 1, !max);
                // could have done max(this.minimax(child, depth + 1, !max))
                if (evalPrime > maxEval) 
                {
                    maxEval = evalPrime; 
                    if (depth == 0) { this.currentBestAction = child.action; }
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for ( let child of this.children(state)) {
                let evalPrime = this.MiniMax(child.child, depth + 1, !max);
                // could have done min(this.minimax(child, depth + 1, !max))
                if (evalPrime < minEval) { minEval = evalPrime;}
            }
            return minEval;
        }
    }

    // here we implement the MIN MAX search with alpha-beta pruning
    // make sure to copy states via state.copy() before generating children othewise modification of references of state will occur on different levels of recursion
    // ARgs:
    // state - state of current node of search tree
    // alpha(int) : current alpha value
    // beta(int) : current beta value
    // depth(int) : current depth of search
    // max(bool) : whether the player is maximizing or not
    //
    // returns: 
    // value(int) : value of the state for the player to move 
    AlphaBeta(state, alpha, beta, depth, max) {
        // check if last node
        if (terminal(state) || depth == this.currentMaxDepth) { return eval(state, this.maxPlayer); }
        // perform time check
        let elapsedTime = performance.now() - this.searchStartTime;
        if (this.config.limit > 0 && elapsedTime > this.config.limit) { throw new TimneoutException(); }

        if (max) {
            let maxEval = -Infinity;
            for ( let child in this.children(state)) {
                let evalPrime = this.AlphaBeta(child, alpha, beta, depth + 1, !max);
                if (evalPrime > maxEval) { maxEval = evalPrime;}
                if (evalPrime > beta) { return maxEval; } // beta cutoff
                if (evalPrime > alpha)
                {
                    alpha = evalPrime;
                    if (depth == 0) { this.currentBestAction = child.lastAction; }
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for ( let child in this.children(state)) {
                let evalPrime = this.AlphaBeta(child, alpha, beta, depth + 1, !max);
                if (evalPrime < minEval) { minEval = evalPrime;}
                if (evalPrime < alpha) { return minEval; } // alpha cutoff
                if (evalPrime < beta) 
                {
                    beta = evalPrime; 
                }
            }
            return minEval;
        }
    }

    // Eval helper function to check score in a direction
    checkScore(row, col, dir, state, player)
    {
        let maxSamePiece = 0;
        let concurrentSamePiece = 0;
        let maxOppPiece = 0;
        let concurrentOppPiece = 0;
        let consecutivePieces = 1;

        // make sure to count the piece at (row, col)
        if (state.get(row,col) == player) { concurrentSamePiece++; maxSamePiece++; }
        else if (state.get(row,col) == (player + 1) % 2) { concurrentOppPiece++; maxOppPiece++; }

        let crow = row, ccol = col;
        for ( let i = 1; i < state.connect; i++)
        {
            crow += dir[0]; ccol += dir[1];
            if (!state.isOnBoard(crow, ccol)) { break;}
            if (state.get(crow, ccol) == PLAYER_NONE) { break;}
            consecutivePieces++;
            if (state.get(crow, ccol) == player) { 
                concurrentSamePiece++;
                if (concurrentSamePiece > maxSamePiece) { maxSamePiece = concurrentSamePiece; }
                concurrentOppPiece = 0;
            } else if (state.get(crow, ccol) == (player + 1) % 2) {
                concurrentOppPiece++;
                if (concurrentOppPiece > maxOppPiece) { maxOppPiece = concurrentOppPiece; }
                concurrentSamePiece = 0;
            }
        }

        // score scheme
        let scoreSame = 100*(2**maxSamePiece) + 15 + consecutivePieces; // 5 placeholder for position advantage
        let scoreOpp = 100*((1.2)*2**maxOppPiece) + 15 + consecutivePieces;
        return Math.max(scoreSame, scoreOpp);
    }

    // here we implement the heuristic evaluation function for the state
    // returns large positive value for win for player, large negative value for loss for player, 0 for draw or no winner
    // be sure to pass player variable into this function, call this with player = this.maxPlayer
    // Args:
    // state : state to evaluate
    // player(int) : player to evaluate the state for
    // Returns:
    // value(int) : heuristic evaluatiaon of the state
    eval(state, player) {

        let winner = state.winner();
        if (winner == player) { return 10000;} // win returns large
        else if (winner == (player + 1) % 2) {return -10000;} // return large negative for loss
        else if (winner == PLAYER_DRAW) { return 0;} // return 0 for draw
        else if (winner == PLAYER_NONE) { 
            // heuristic here goes between large negative and large positive
            // we will want to most likely start in the middle to get the most connections
            let bestScores = -500;
            for ( let row = 0; row < state.height; row++) {
                for ( let col = 0; col < state.width; col++) {

                    // evaluate each position on the board for potential connections    
                    if (state.get(col, row) != PLAYER_NONE) {
                        // check horizontally, vertically, and diagonally for potential connections
                        for ( let dir of state.dirs) {
                            let score = this.checkScore(col, row, dir, state, player);
                            bestScores = Math.max(bestScores, score);
                        }
                    }
                }
            }
            return bestScores; 
        }
    }

    // function to return zobrist hash value for the state
    // args:
    // state : state to get the hash value for
    // returns:
    // value(int) : zobrist hash value for the state
    getZobristHash(state) {
        // implement Zobrist hashing here
        return 0;
    }
}