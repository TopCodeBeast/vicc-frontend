#!/usr/bin/python
import re
import sys
import os
import io
import shutil
import random
import string
import json
from fnmatch import fnmatch
from shutil import copytree

classNameList = []

def updateTypes(filePath):
    print(filePath)
    text = ''
    with open(filePath, 'r', encoding='utf-8') as fp:
        text = fp.read()

    updated = text

    updated = updated.replace("LAST_FIVE_SO5_AVERAGE_SCORE", "LAST_FIVE_VICC5_AVERAGE_SCORE")
    updated = updated.replace("LAST_FIFTEEN_SO5_AVERAGE_SCORE", "LAST_FIFTEEN_VICC5_AVERAGE_SCORE")

    updated = updated.replace("sport: FOOTBALL", "sport: CRICKET")
    updated = updated.replace("TokenFootballMetadata", "TokenCricketMetadata")
    updated = updated.replace("sorarePrivateKeyRecovery", "viccPrivateKeyRecovery")
    updated = updated.replace("sorarePrivateKey", "viccPrivateKey")
    updated = updated.replace("sorareEncryptionKey", "viccEncryptionKey")
    updated = updated.replace("sorareTokensAddress", "viccTokensAddress")
    updated = updated.replace("sorareCardsAddress", "viccCardsAddress")
    updated = updated.replace("sorareAddress", "viccAddress")
    updated = updated.replace("sorareManaged", "viccManaged")
    
    updated = updated.replace("FOOTBALL = 'FOOTBALL'", "CRICKET = 'CRICKET'")
    updated = updated.replace("Sport.FOOTBALL", "Sport.CRICKET")
    updated = updated.replace("footballCardCollections", "cricketCardCollections")
    updated = updated.replace("footballProfile", "cricketProfile")
    updated = updated.replace("footballLast30DaysLineupsCount", "cricketLast30DaysLineupsCount")
    updated = updated.replace("footballNationalSeriesTokensAddress", "cricketNationalSeriesTokensAddress")

    if text != updated:
        with open(filePath, 'w+', encoding='utf-8') as fp:
            fp.write(updated)

if __name__ == '__main__':
    src = './packages'
    for path, subdirs, files in os.walk(src):
        for name in files:
            if fnmatch(name, "*.tsx") or fnmatch(name, "*.ts"):
                filePath = os.path.join(path, name)
                updateTypes(filePath)
