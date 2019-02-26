/***********检查IP 是否为网段或广播IP合法性*/
function checkIsVoildIpMask(ip, mask, str) {
    var ipArry,
        maskArry,
        len,
        maskArry2 = [],
        netIndex = 0,
        netIndex1 = 0,
        broadIndex = 0,
        i, k, j;

    str = str || _("IP Address");

    ipArry = ip.split(".");
    maskArry = mask.split(".");
    len = ipArry.length;

    for (i = 0; i < len; i++) {
        maskArry2[i] = 255 - Number(maskArry[i]);
    }

    for (k = 0; k < 4; k++) { // ip & mask
        if ((ipArry[k] & maskArry[k]) == 0) {
            netIndex1 += 0;
        } else {
            netIndex1 += 1;
        }
    }
    for (k = 0; k < 4; k++) { // ip & 255 - mask
        if ((ipArry[k] & maskArry2[k]) == 0) {
            netIndex += 0;
        } else {
            netIndex += 1;
        }
    }

    if (netIndex == 0 || netIndex1 == 0) {
        return _("%s cannot be a network address.", [str]);
    }

    for (j = 0; j < 4; j++) {
        if ((ipArry[j] | maskArry[j]) == 255) {
            broadIndex += 0;
        } else {
            broadIndex += 1;
        }
    }

    if (broadIndex == 0) {
        return _("%s cannot be a broadcast address.", [str]);
    }

    return;
}

export default checkIsVoildIpMask;