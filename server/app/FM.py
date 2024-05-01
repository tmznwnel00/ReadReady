import tensorflow as tf

class FactorizationMachine(tf.keras.Model):
    def __init__(self, num_features, num_factors, reg_w=0.01, reg_v=0.01):
        super(FactorizationMachine, self).__init__()
        self.num_features = num_features
        self.num_factors = num_factors
        self.reg_w = reg_w
        self.reg_v = reg_v
        
        # Parameters
        self.w_0 = tf.Variable(tf.zeros(1))
        self.w = tf.Variable(tf.zeros(num_features))
        self.V = tf.Variable(tf.random.normal(shape=(num_features, num_factors)))
        
    def call(self, inputs):
        # Linear terms
        linear_terms = tf.reduce_sum(tf.nn.embedding_lookup(self.w, inputs), axis=1)  # (batch_size,)
        
        # Pairwise interactions
        interactions = 0.5 * tf.reduce_sum(
            tf.pow(tf.matmul(tf.nn.embedding_lookup(self.V, inputs), tf.expand_dims(inputs, axis=-1)), 2)
            - tf.matmul(tf.pow(tf.nn.embedding_lookup(self.V, inputs), 2), tf.pow(tf.expand_dims(inputs, axis=-1), 2)),
            axis=[1, 2]
        )  # (batch_size,)
        
        # Output
        output = tf.math.sigmoid(self.w_0 + linear_terms + interactions)
        return output
    
    
num_features = 1000
num_factors = 10
model = FactorizationMachine(num_features, num_factors)
optimizer = tf.keras.optimizers.Adam()

# training part TBD
# for epoch in range(num_epochs):
#     for batch_inputs, batch_labels in train_dataset:
#         with tf.GradientTape() as tape:
#             predictions = model(batch_inputs)
#             loss = tf.reduce_mean(tf.losses.mean_squared_error(batch_labels, predictions))
#             # Add regularization terms
#             loss += model.reg_w * (tf.nn.l2_loss(model.w) + tf.nn.l2_loss(model.V))
        
#         gradients = tape.gradient(loss, model.trainable_variables)
#         optimizer.apply_gradients(zip(gradients, model.trainable_variables))