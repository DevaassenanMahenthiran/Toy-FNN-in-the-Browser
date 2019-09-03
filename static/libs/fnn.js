class FNN {
   constructor(lr, xs, hs, os, ihw, how, hb, ob) {
        // hyperparams
        this.lr = lr;

        // weights
        this.ihw = ihw ? math.matrix(ihw) : math.matrix(math.random([xs, hs]));
        this.how = how ? math.matrix(how) : math.matrix(math.random([hs, os]));

        // biases
        this.hb = hb ? math.matrix(hb) : math.matrix(math.random([1, hs]));
        this.ob = ob ? math.matrix(ob) : math.matrix(math.random([1, os]));

        // loss
        this.loss = null;
   }

   train(epochs, data) {
      for (let epoch = 0; epoch < epochs; epoch++) {
         let losses = [];
         this.shuffle(data).forEach(group => {
            // converting input and output for this iteration into viable matrices
            const input = math.reshape(math.matrix(group.inputs), [1, group.inputs.length]);
            const target = math.reshape(math.matrix(group.outputs), [1, group.outputs.length]);

            // feedforward; get outputss
            let [hidden, guess] = this.feedforward(input);

            // calculate errors
            let guessErrors = math.subtract(guess, target);
            let hiddenErrors = math.multiply(guessErrors, math.transpose(this.how));

            // store guess error for analysis
            losses.push(math.mean(math.dotMultiply(guessErrors, guessErrors)));

            // backpropogate; get deltas for weights and biases
            let [ob_deltas, hb_deltas, how_deltas, ihw_deltas] = this.backpropagate(input, hidden, guess, guessErrors, hiddenErrors);

            // apply deltas to weights
            this.ihw = math.subtract(this.ihw, ihw_deltas);
            this.how = math.subtract(this.how, how_deltas);

            // apply deltas to biases
            this.hb = math.subtract(this.hb, hb_deltas);
            this.ob = math.subtract(this.ob, ob_deltas)
         });
         // get average loss over all training data for this epoch
         this.loss = math.mean(losses);
      }
   }

   guess(inputs) { // function for just getting the output; just feedforward,  backpropagation
      let [h, gy] = this.feedforward(math.reshape(math.matrix(inputs), [1, inputs.length]));

      return gy._data[0];
   }

   feedforward(input) {
      // feedforward sequence
      const x = input;
      const h = math.add(math.multiply(x, this.ihw), this.hb).map(this.sigmoid);
      const gy = math.add(math.multiply(h, this.how), this.ob).map(this.sigmoid);

      return [h, gy]; // return the computed layers
   }

   backpropagate(input, hidden, guess, guessErrors, hiddenErrors) {
      // compute weights (incomplete) and bias gradients
      let how_gradients = math.dotMultiply(math.dotMultiply(guess.map(this.sigmoidPrime), guessErrors), this.lr);
      let ihw_gradients = math.dotMultiply(math.dotMultiply(hidden.map(this.sigmoidPrime), hiddenErrors), this.lr);

      // compute weight gradients
      let how_deltas = math.multiply(math.transpose(hidden), how_gradients);
      let ihw_deltas = math.multiply(math.transpose(input), ihw_gradients);

      return [how_gradients, ihw_gradients, how_deltas, ihw_deltas] // return the computed deltas
   }

   shuffle(array) { // to randomize data to help the neural network generalize
      array.sort(() => Math.random() - 0.5);
      
      return array;
    }
   
   sigmoid(x) { // chosen non-linear function
      return 1 / (1 + math.exp(-x));
   }

   sigmoidPrime(x) { // derivative of the chosen non-linear function
      return x * (1 - x);
   }
}