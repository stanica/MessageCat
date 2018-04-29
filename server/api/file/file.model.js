'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './file.events';

var FileSchema = new mongoose.Schema({
  espIdac: Number,
  folder: String,
  fileName: String,
  boot: { type: Boolean, default: 0 },
  active: { type: Boolean, default: true }
});

registerEvents(FileSchema);
export default mongoose.model('File', FileSchema);
