import json

with open("raw_presale.json") as executionFileNameLoaded:
  retrievedElements = json.load(executionFileNameLoaded)
  executionFileNameLoaded.close()

cleanList = {}

for item in retrievedElements:
  if item['signedByAddress'] is None:
    continue
  # print(item['signedByAddress'])
  cleanList[item['signedByAddress']] = 0

print(cleanList)

with open("walletsAndAllowanceList-presale.json", 'w') as f:
  json.dump(cleanList, f)