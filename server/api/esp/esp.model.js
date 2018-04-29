'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './esp.events';

var EspSchema = new mongoose.Schema({
  name: String,
  chipId: String,
  description: String,
  update: { type: Number, default: 0 },
  heartbeat: Date,
  active: { type: Boolean, default: true },
  id: Number
});

registerEvents(EspSchema);
export default mongoose.model('Esp', EspSchema);
