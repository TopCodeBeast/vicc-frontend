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

def replace(text, oldvalue, newvalue, startIndex, endIndex):
    i = 0
    while i >= 0:
        if endIndex >= 0: i = text.find(oldvalue, startIndex, endIndex)
        else: i = text.find(oldvalue, startIndex)
        if i >= 0:
            text = text[:i] + newvalue + text[i + len(oldvalue):]
    return text

def remove_football(text):
    search = "football {"
    startIndex = 0
    while startIndex >= 0:
        startIndex = text.find(search, startIndex)
        if startIndex >= 0:
            endIndex = text.find("\n    }", startIndex)
            if endIndex >= 0:
                text = text[:endIndex + 5] + "#}" + text[endIndex + 6:]
                text = text[:startIndex] + '#' + search + text[startIndex + len(search):]
            startIndex += len(search)

    return text


def updateTypes(filePath):
    print(filePath)
    text = ''
    with open(filePath, 'r', encoding='utf-8') as fp:
        text = fp.read()

    code = text
    code = code.replace("LAST_FIVE_SO5_AVERAGE_SCORE", "LAST_FIVE_VICC5_AVERAGE_SCORE")
    code = code.replace("LAST_FIFTEEN_SO5_AVERAGE_SCORE", "LAST_FIFTEEN_VICC5_AVERAGE_SCORE")

    code = code.replace("sport: FOOTBALL", "sport: CRICKET")
    code = code.replace("TokenFootballMetadata", "TokenCricketMetadata")
    code = code.replace("sorarePrivateKeyRecovery", "viccPrivateKeyRecovery")
    code = code.replace("sorarePrivateKey", "viccPrivateKey")
    code = code.replace("sorareEncryptionKey", "viccEncryptionKey")
    code = code.replace("sorareTokensAddress", "viccTokensAddress")
    code = code.replace("sorareCardsAddress", "viccCardsAddress")
    code = code.replace("sorareAddress", "viccAddress")
    code = code.replace("sorareManaged", "viccManaged")
    
    code = code.replace("FOOTBALL = 'FOOTBALL'", "CRICKET = 'CRICKET'")
    code = code.replace("sports: [FOOTBALL, NBA, BASEBALL]", "sports: [CRICKET, NBA, BASEBALL]")
    code = code.replace("Sport.FOOTBALL", "Sport.CRICKET")
    code = code.replace("footballTokensAddress", "cricketTokensAddress")
    code = code.replace("footballCardCollections", "cricketCardCollections")
    code = code.replace("footballProfile", "cricketProfile")
    code = code.replace("footballLast30DaysLineupsCount", "cricketLast30DaysLineupsCount")
    code = code.replace("footballNationalSeriesTokensAddress", "cricketNationalSeriesTokensAddress")

    startIndex = 0
    while True:
        endIndex = code.find(" from '", startIndex)
        code = replace(code, "so5", "vicc5", startIndex, endIndex)
        code = replace(code, "So5", "Vicc5", startIndex, endIndex)
        if endIndex < 0: break
        startIndex = code.index("'", code.index("'", endIndex) + 1)

    code = remove_football(code)
    
    if code != text:
        with open(filePath, 'w+', encoding='utf-8') as fp:
            fp.write(code)

if __name__ == '__main__':
    src = './packages'
    for path, subdirs, files in os.walk(src):
        for name in files:
            if fnmatch(name, "*.tsx") or fnmatch(name, "*.ts"):
                filePath = os.path.join(path, name)
                updateTypes(filePath)
