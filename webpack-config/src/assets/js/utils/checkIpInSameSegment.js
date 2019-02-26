/********判断是否同网段****************/
function checkIpInSameSegment(ip_lan, mask_lan, ip_wan, mask_wan) {
    if (ip_lan === '' || ip_wan === '') {
        return false;
    }
    var ip1Arr = ip_lan.split("."),
        ip2Arr = ip_wan.split("."),
        maskArr1 = mask_lan.split("."),
        maskArr2 = mask_wan.split("."),
        maskArr = maskArr1,
        i;
    for (i = 0; i < 4; i++) {
        if (maskArr1[i] != maskArr2[i]) {
            if (maskArr1[i] & maskArr2[i] == maskArr1[i]) {
                maskArr = maskArr1;
            } else {
                maskArr = maskArr2;
            }
            break;
        }
    }
    for (i = 0; i < 4; i++) {
        if ((ip1Arr[i] & maskArr[i]) != (ip2Arr[i] & maskArr[i])) {
            return false;
        }
    }
    return true;
}

export default checkIpInSameSegment;