'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './file.events';

var FileSchema = new mongoose.Schema({
  chipId: Number,
  folder: String,
  fileName: String,
  boot: Boolean,
  active: Boolean
});

registerEvents(FileSchema);
export default mongoose.model('File', FileSchema);
