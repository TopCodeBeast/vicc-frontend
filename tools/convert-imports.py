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

def updateImports(filePath):
    text = ''
    with open(filePath, 'r', encoding='utf-8') as fp:
        text = fp.read()

    updated = text

    updated = updated.replace("from 'react-spring'", "from '@react-spring/web'")
    
    if filePath.find("\\core\\src\\") >= 0:
        updated = updated.replace("from 'assets/", "from '@core/assets/")
        updated = updated.replace("from 'atoms/", "from '@core/atoms/")
        updated = updated.replace("from 'components/", "from '@core/components/")
        updated = updated.replace("from 'config'", "from '@core/config'")
        updated = updated.replace("from 'constants/", "from '@core/constants/")
        updated = updated.replace("from 'contexts/", "from '@core/contexts/")
        updated = updated.replace("from 'errors/", "from '@core/errors/")
        updated = updated.replace("from 'gql/", "from '@core/gql/")
        updated = updated.replace("from 'hooks/", "from '@core/hooks/")
        updated = updated.replace("from 'i18n/", "from '@core/i18n/")
        updated = updated.replace("from 'lib/", "from '@core/lib/")
        updated = updated.replace("from 'protos/", "from '@core/protos/")
        updated = updated.replace("from 'routing/", "from '@core/routing/")
        updated = updated.replace("from 'style/", "from '@core/style/")

    if filePath.find("\\football\\src\\") >= 0:
        updated = updated.replace("from 'components/", "from '@football/components/")
        updated = updated.replace("from 'contexts/", "from '@football/contexts/")
        updated = updated.replace("from 'hooks/", "from '@football/hooks/")
        updated = updated.replace("from 'lib/", "from '@football/lib/")
        updated = updated.replace("from 'pages/", "from '@football/pages/")
        updated = updated.replace("from 'routing/", "from '@football/routing/")
        updated = updated.replace("from 'types/", "from '@football/types/")
        updated = updated.replace("() => import('pages/", "() => import('@football/pages/")

    if filePath.find("\\marketplace\\src\\") >= 0:
        updated = updated.replace("from 'components/", "from '@marketplace/components/")
        updated = updated.replace("from 'contexts/", "from '@marketplace/contexts/")
        updated = updated.replace("from 'hooks/", "from '@marketplace/hooks/")
        updated = updated.replace("from 'lib/", "from '@marketplace/lib/")
        updated = updated.replace("from 'search/", "from '@marketplace/search/")
        updated = updated.replace("from 'searchCards/", "from '@marketplace/searchCards/")
        updated = updated.replace("from 'types/", "from '@marketplace/types/")
        updated = updated.replace("() => import('pages/", "() => import('@marketplace/pages/")

    if text != updated:
        with open(filePath, 'w+', encoding='utf-8') as fp:
            fp.write(updated)

if __name__ == '__main__':
    src = './'
    for path, subdirs, files in os.walk(src):
        for name in files:
            if fnmatch(name, "*.tsx") or fnmatch(name, "*.ts"):
                filePath = os.path.join(path, name)
                updateImports(filePath)
