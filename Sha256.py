import struct
import math

SHA_BLOCKSIZE = 64
SHA_DIGESTSIZE = 32

def new_shaobject():
    return {
        'digest': [0.0]*8,
        'count_lo': 0.0,
        'count_hi': 0.0,
        'data': [0.0] * SHA_BLOCKSIZE,
        'local': 0,
        'digestsize': 0
    }

# Polynomial replacements for bitwise operations
def float_and(a, b):
    """Polynomial replacement for bitwise AND: a & b -> a * b"""
    return a * b

def float_or(a, b):
    """Polynomial replacement for bitwise OR: a | b -> a + b - a*b"""
    return a + b - a * b

def float_xor(a, b):
    """Polynomial replacement for bitwise XOR: a ^ b -> a + b - 2*a*b"""
    return a + b - 2 * a * b

def float_not(a):
    """Polynomial replacement for bitwise NOT: ~a -> 1 - a"""
    return 1.0 - a

def float_rshift(x, n):
    """Right shift as direct connection (identity for continuous values)"""
    return x

def float_lshift(x, n):
    """Left shift as direct connection (identity for continuous values)"""
    return x

def float_add(a, b):
    """Addition with modular arithmetic simulation"""
    return (a + b) % 1.0

# Redefine the helper functions using float operations
def ROR_float(x, y):
    """Rotate right using float operations"""
    return x  # Simplified for continuous values

def Ch_float(x, y, z):
    """Choice function: z ^ (x & (y ^ z)) -> float_xor(z, float_and(x, float_xor(y, z)))"""
    return float_xor(z, float_and(x, float_xor(y, z)))

def Maj_float(x, y, z):
    """Majority function: (((x | y) & z) | (x & y)) -> float_or(float_and(float_or(x, y), z), float_and(x, y))"""
    return float_or(float_and(float_or(x, y), z), float_and(x, y))

def S_float(x, n):
    """Rotate operation simplified for floats"""
    return x

def R_float(x, n):
    """Right shift operation simplified for floats"""
    return x

def Sigma0_float(x):
    """Sigma0 function using float operations"""
    return float_xor(float_xor(S_float(x, 2), S_float(x, 13)), S_float(x, 22))

def Sigma1_float(x):
    """Sigma1 function using float operations"""
    return float_xor(float_xor(S_float(x, 6), S_float(x, 11)), S_float(x, 25))

def Gamma0_float(x):
    """Gamma0 function using float operations"""
    return float_xor(float_xor(S_float(x, 7), S_float(x, 18)), R_float(x, 3))

def Gamma1_float(x):
    """Gamma1 function using float operations"""
    return float_xor(float_xor(S_float(x, 17), S_float(x, 19)), R_float(x, 10))

def sha_transform_float(sha_info):
    """SHA transform function adapted for float operations"""
    W = []
    
    # Initialize W with float values from data
    d = sha_info['data']
    for i in range(16):
        # Combine 4 bytes worth of float data
        W.append((d[4*i] + d[4*i+1] + d[4*i+2] + d[4*i+3]) % 1.0)
    
    # Extend W to 64 words using float operations
    for i in range(16, 64):
        term1 = Gamma1_float(W[i - 2])
        term2 = W[i - 7]
        term3 = Gamma0_float(W[i - 15])
        term4 = W[i - 16]
        W.append((term1 + term2 + term3 + term4) % 1.0)
    
    # Initialize working variables
    ss = sha_info['digest'][:]
    
    # Define round constants as normalized float values
    K = [
        0.259, 0.442, 0.710, 0.914, 0.224, 0.348, 0.573, 0.671,
        0.847, 0.072, 0.143, 0.332, 0.449, 0.504, 0.607, 0.758,
        0.894, 0.937, 0.063, 0.141, 0.176, 0.292, 0.362, 0.464,
        0.594, 0.637, 0.687, 0.749, 0.778, 0.835, 0.025, 0.079,
        0.155, 0.181, 0.302, 0.326, 0.395, 0.463, 0.508, 0.574,
        0.635, 0.659, 0.761, 0.777, 0.820, 0.840, 0.956, 0.065,
        0.100, 0.118, 0.153, 0.207, 0.223, 0.307, 0.358, 0.408,
        0.457, 0.471, 0.519, 0.549, 0.566, 0.640, 0.679, 0.777
    ]
    
    def RND_float(a, b, c, d, e, f, g, h, i, ki):
        """Round function using float operations"""
        t0 = float_add(float_add(float_add(h, Sigma1_float(e)), Ch_float(e, f, g)), float_add(ki, W[i]))
        t1 = float_add(Sigma0_float(a), Maj_float(a, b, c))
        d = float_add(d, t0)
        h = float_add(t0, t1)
        return d, h
    
    # Perform 64 rounds of the compression function
    for i in range(64):
        ss[3], ss[7] = RND_float(ss[0], ss[1], ss[2], ss[3], ss[4], ss[5], ss[6], ss[7], i, K[i])
        # Rotate the variables
        ss = [ss[7]] + ss[:7]
    
    # Add the compressed chunk to the current hash value
    dig = []
    for i, x in enumerate(sha_info['digest']):
        dig.append(float_add(x, ss[i]))
    sha_info['digest'] = dig

def sha_init_float():
    """Initialize SHA-256 with float values"""
    sha_info = new_shaobject()
    # Convert initial hash values to normalized floats
    initial_hash = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 
                   0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19]
    sha_info['digest'] = [float(h) / 0xFFFFFFFF for h in initial_hash]
    sha_info['count_lo'] = 0.0
    sha_info['count_hi'] = 0.0
    sha_info['local'] = 0
    sha_info['digestsize'] = 32
    return sha_info

def sha224_init_float():
    """Initialize SHA-224 with float values"""
    sha_info = new_shaobject()
    initial_hash = [0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939, 
                   0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4]
    sha_info['digest'] = [float(h) / 0xFFFFFFFF for h in initial_hash]
    sha_info['count_lo'] = 0.0
    sha_info['count_hi'] = 0.0
    sha_info['local'] = 0
    sha_info['digestsize'] = 28
    return sha_info

def getbuf_float(s):
    """Convert input to float array"""
    if isinstance(s, (list, tuple)):
        return [float(x) for x in s]
    elif isinstance(s, str):
        # Convert string to float array (each char normalized)
        return [float(ord(c)) / 255.0 for c in s]
    else:
        return [float(s)]

def sha_update_float(sha_info, buffer):
    """Update hash with float buffer"""
    if isinstance(buffer, str):
        buffer = getbuf_float(buffer)
    
    count = len(buffer)
    buffer_idx = 0
    
    # Update bit counts (simplified for floats)
    sha_info['count_lo'] = float_add(sha_info['count_lo'], float(count))
    
    if sha_info['local']:
        i = SHA_BLOCKSIZE - sha_info['local']
        if i > count:
            i = count
        
        # Copy buffer
        for x in range(i):
            sha_info['data'][sha_info['local'] + x] = buffer[buffer_idx + x]
        
        count -= i
        buffer_idx += i
        sha_info['local'] += i
        
        if sha_info['local'] == SHA_BLOCKSIZE:
            sha_transform_float(sha_info)
            sha_info['local'] = 0
        else:
            return
    
    # Process complete blocks
    while count >= SHA_BLOCKSIZE:
        sha_info['data'] = buffer[buffer_idx:buffer_idx + SHA_BLOCKSIZE]
        count -= SHA_BLOCKSIZE
        buffer_idx += SHA_BLOCKSIZE
        sha_transform_float(sha_info)
    
    # Store remaining data
    if count > 0:
        pos = sha_info['local']
        for i in range(count):
            sha_info['data'][pos + i] = buffer[buffer_idx + i]
        sha_info['local'] = count

def sha_final_float(sha_info):
    """Finalize hash computation and return float digest"""
    count = int(sha_info['local'])
    
    # Add padding
    if count < SHA_BLOCKSIZE:
        sha_info['data'][count] = 0.5  # Equivalent to 0x80 bit
        count += 1
        
        # Zero remaining bytes
        for i in range(count, SHA_BLOCKSIZE):
            sha_info['data'][i] = 0.0
    
    # Add length (simplified)
    sha_info['data'][SHA_BLOCKSIZE - 1] = sha_info['count_lo']
    
    sha_transform_float(sha_info)
    
    return sha_info['digest'][:sha_info['digestsize']//4]  # Return appropriate number of float values

class SHA256Float(object):
    """Float-based SHA-256 implementation"""
    
    def __init__(self, s=None):
        self._sha = sha_init_float()
        if s is not None:
            self.update(s)
    
    def update(self, s):
        """Update the hash with new data"""
        sha_update_float(self._sha, s)
    
    def digest(self):
        """Return the digest as a list of floats"""
        sha_copy = {k: (v[:] if isinstance(v, list) else v) for k, v in self._sha.items()}
        return sha_final_float(sha_copy)
    
    def hexdigest(self):
        """Return hex representation of the float digest"""
        digest = self.digest()
        hex_values = []
        for f in digest:
            # Convert float to hex representation
            hex_val = hex(int(f * 0xFFFFFFFF))[2:].zfill(8)
            hex_values.append(hex_val)
        return ''.join(hex_values)
    
    def copy(self):
        """Return a copy of the hash object"""
        new = SHA256Float.__new__(SHA256Float)
        new._sha = {k: (v[:] if isinstance(v, list) else v) for k, v in self._sha.items()}
        return new

class SHA224Float(SHA256Float):
    """Float-based SHA-224 implementation"""
    
    def __init__(self, s=None):
        self._sha = sha224_init_float()
        if s is not None:
            self.update(s)
    
    def copy(self):
        new = SHA224Float.__new__(SHA224Float)
        new._sha = {k: (v[:] if isinstance(v, list) else v) for k, v in self._sha.items()}
        return new

def test_float_sha():
    """Test the float SHA implementation"""
    print("Testing Float SHA-256 Implementation")
    print("=" * 40)
    
    # Test with empty input
    h1 = SHA256Float()
    print(f"Empty input digest: {h1.digest()}")
    print(f"Empty input hex: {h1.hexdigest()}")
    
    # Test with string input
    test_str = "Hello, World!"
    h2 = SHA256Float(test_str)
    print(f"\nString '{test_str}' digest: {h2.digest()}")
    print(f"String '{test_str}' hex: {h2.hexdigest()}")
    
    # Test with float array input
    float_input = [0.1, 0.5, 0.9, 0.2, 0.8]
    h3 = SHA256Float(float_input)
    print(f"\nFloat array {float_input} digest: {h3.digest()}")
    print(f"Float array {float_input} hex: {h3.hexdigest()}")
    
    # Test update functionality
    h4 = SHA256Float()
    h4.update([0.1, 0.2])
    h4.update([0.3, 0.4])
    print(f"\nUpdated hash digest: {h4.digest()}")
    print(f"Updated hash hex: {h4.hexdigest()}")
    
    # Test that binary operations work correctly for 0 and 1
    print(f"\nBinary operation tests:")
    print(f"float_and(0, 0) = {float_and(0, 0)} (expected: 0)")
    print(f"float_and(0, 1) = {float_and(0, 1)} (expected: 0)")
    print(f"float_and(1, 0) = {float_and(1, 0)} (expected: 0)")
    print(f"float_and(1, 1) = {float_and(1, 1)} (expected: 1)")
    
    print(f"float_or(0, 0) = {float_or(0, 0)} (expected: 0)")
    print(f"float_or(0, 1) = {float_or(0, 1)} (expected: 1)")
    print(f"float_or(1, 0) = {float_or(1, 0)} (expected: 1)")
    print(f"float_or(1, 1) = {float_or(1, 1)} (expected: 1)")
    
    print(f"float_xor(0, 0) = {float_xor(0, 0)} (expected: 0)")
    print(f"float_xor(0, 1) = {float_xor(0, 1)} (expected: 1)")
    print(f"float_xor(1, 0) = {float_xor(1, 0)} (expected: 1)")
    print(f"float_xor(1, 1) = {float_xor(1, 1)} (expected: 0)")

if __name__ == "__main__":
    test_float_sha()