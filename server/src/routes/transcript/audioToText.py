import sys
import deepspeech
import wave
import numpy as np
import os

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

script_dir = os.path.dirname(os.path.abspath(__file__))
model_file_path = os.path.join(script_dir, '../../../models/deepspeech-0.9.3-models.pbmm')
scorer_file_path = os.path.join(script_dir, '../../../models/deepspeech-0.9.3-models.scorer')
audio_file_path = sys.argv[1]

model = deepspeech.Model(model_file_path)
model.enableExternalScorer(scorer_file_path)

with wave.open(audio_file_path, 'rb') as w:
    if w.getframerate() != 16000:
        raise ValueError("Audio file must be at 16kHz sample rate")
    if w.getnchannels() != 1:
        raise ValueError("Audio file must be mono")

    frames = w.getnframes()
    buffer = w.readframes(frames)
    data16 = np.frombuffer(buffer, dtype=np.int16)

text = model.stt(data16)
print(text)
