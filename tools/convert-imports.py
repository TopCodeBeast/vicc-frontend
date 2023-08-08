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

    if filePath.find("marketplace\\src\\hooks\\tokens\\useOwnerAccount.tsx") >= 0:
        updated = updated.replace("account: useOwnerAccount_account | null;", "account?: useOwnerAccount_account | null;")

    if filePath.find("core\\src\\components\\wallet\\BankEthAccounting\\AddFundsToFiatWallet\\WireTransfer\\index.tsx") >= 0:
        updated = updated.replace("addressLine1: string | null;", "addressLine1?: string | null;")

    if filePath.find("\\core\\src\\") >= 0:
        updated = updated.replace("from 'assets/", "from '@core/assets/")
        updated = updated.replace("from 'atoms/", "from '@core/atoms/")
        updated = updated.replace("from 'components/", "from '@core/components/")
        updated = updated.replace("from 'config'", "from '@core/config'")
        updated = updated.replace("from 'errors'", "from '@core/errors'")
        updated = updated.replace("from 'gql'", "from '@core/gql'")
        updated = updated.replace("from 'types'", "from '@core/types'")
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
        updated = updated.replace("from 'assets/", "from '@football/assets/")
        updated = updated.replace("from 'components/", "from '@football/components/")
        updated = updated.replace("from 'contexts/", "from '@football/contexts/")
        updated = updated.replace("from 'hooks/", "from '@football/hooks/")
        updated = updated.replace("from 'lib/", "from '@football/lib/")
        updated = updated.replace("from 'pages/", "from '@football/pages/")
        updated = updated.replace("from 'routing/", "from '@football/routing/")
        updated = updated.replace("from 'types/", "from '@football/types/")
        updated = updated.replace("() => import('pages/", "() => import('@football/pages/")
        updated = updated.replace("() => import('modales/", "() => import('@football/modales/")

    if filePath.find("\\marketplace\\src\\") >= 0:
        updated = updated.replace("from 'components/", "from '@marketplace/components/")
        updated = updated.replace("from 'contexts/", "from '@marketplace/contexts/")
        updated = updated.replace("from 'hooks/", "from '@marketplace/hooks/")
        updated = updated.replace("from 'lib/", "from '@marketplace/lib/")
        updated = updated.replace("from 'search/", "from '@marketplace/search/")
        updated = updated.replace("from 'searchCards/", "from '@marketplace/searchCards/")
        updated = updated.replace("from 'types/", "from '@marketplace/types/")
        updated = updated.replace("() => import('pages/", "() => import('@marketplace/pages/")
        updated = updated.replace("() => import('components/", "() => import('@marketplace/components/")

    if filePath.find("\\shared-pages\\src\\") >= 0:
        updated = updated.replace("from 'Settings/", "from '@shared-pages/Settings/")
        updated = updated.replace("from 'Careers/", "from '@shared-pages/Careers/")

    if filePath.find("\\us-sports\\src\\") >= 0:
        updated = updated.replace("from 'components/", "from '@us-sports/components/")
        updated = updated.replace("from 'contexts/", "from '@us-sports/contexts/")
        updated = updated.replace("from 'hooks/", "from '@us-sports/hooks/")
        updated = updated.replace("from 'lib/", "from '@us-sports/lib/")

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
