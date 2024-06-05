import time

import tensorflow as tf
import numpy as np

from .trainset import vectorX, vectorY, user_set, book_set, grouped_rating_data

class FactorizationMachine(tf.keras.Model):
    def __init__(self, num_features, num_factors, reg_w=0.02, reg_v=0.02):
        super(FactorizationMachine, self).__init__()
        self.num_features = num_features
        self.num_factors = num_factors
        self.reg_w = reg_w
        self.reg_v = reg_v
        
        # Parameters
        self.w_0 = self.add_weight(shape=(1,), initializer='zeros', trainable=True)
        self.w = self.add_weight(shape=(num_features,), initializer='zeros', trainable=True)
        self.V = self.add_weight(shape=(num_features, num_factors), initializer='random_normal', trainable=True)
        
    def call(self, inputs):
        # Linear terms
        linear_terms = tf.reduce_sum(tf.multiply(inputs, self.w), axis=1)
        
        # Pairwise interactions
        interactions = 0.5 * tf.reduce_sum(
            tf.pow(tf.matmul(inputs, self.V), 2)
            - tf.matmul(tf.pow(inputs, 2), tf.pow(self.V, 2)),
            axis=1
        )
        
        # Output
        output = tf.math.sigmoid(self.w_0 + linear_terms + interactions)
        return output
    
train_dataset = tf.data.Dataset.from_tensor_slices((vectorX, vectorY))
    
num_features = vectorX.shape[1]
num_factors = 10
model = FactorizationMachine(num_features, num_factors)
optimizer = tf.keras.optimizers.RMSprop(learning_rate = 0.001)

num_epochs = 5
for epoch in range(num_epochs):
    epoch_loss = 0
    num_batches = 0
    for batch_inputs, batch_labels in train_dataset.batch(32):
        with tf.GradientTape() as tape:
            predictions = model(batch_inputs)
            loss = tf.reduce_mean(tf.keras.losses.MeanSquaredError()(batch_labels, predictions))
            # Add regularization terms
            loss += model.reg_w * (tf.nn.l2_loss(model.w) + tf.nn.l2_loss(model.V))
        
        gradients = tape.gradient(loss, model.trainable_variables)
        optimizer.apply_gradients(zip(gradients, model.trainable_variables))

        epoch_loss += loss
        num_batches += 1

    average_epoch_loss = epoch_loss / num_batches
    print(f'Epoch {epoch + 1}/{num_epochs}, Loss: {average_epoch_loss.numpy()}')
        
        
def recommendation(username, model=model):
    user_matrix = []
    read_book = len(grouped_rating_data[username])
    last_book_index = book_set.index(grouped_rating_data[username][-1])
    book_list = []
    for index, book in enumerate(book_set):
        if book in grouped_rating_data[username]:
            continue
        
        book_list.append(book)
        user_vector = [0 for i in range(len(vectorX[1]))]
        user_vector[user_set.index(username)] = 1
        user_vector[len(user_set) + index] = 1
        
        user_vector[len(user_set) + len(book_set) + index] = round(1 / read_book+1, 2)
        user_vector[len(user_set) + len(book_set)*2 + index] = round(time.time())
        user_vector[len(user_set) + len(book_set)*2+ 1 + last_book_index] = 1
        
        user_matrix.append(user_vector) 
        
    predict_rating = model(np.array(user_matrix))

    book_result = []
    for index, rating in enumerate(predict_rating):
        if float(rating) >= 0.8:
            book_result.append(book_list[index])
    return book_result

    
    
    