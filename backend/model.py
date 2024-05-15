# %%
import tensorflow as tf
# from tensorflow.layers.Sequential import Conv2D

# %%
model = tf.keras.models.load_model(
    '30042024-112453.keras', custom_objects={'Conv2D': tf.keras.layers.Conv2D})
