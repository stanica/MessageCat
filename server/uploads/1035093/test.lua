require "log"

l = file.list();
for k,v in pairs(l) do
  log("name:"..k..", size:"..v)
end