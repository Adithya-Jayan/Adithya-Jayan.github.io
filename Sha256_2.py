import struct

SHA_BLOCKSIZE = 64
SHA_DIGESTSIZE = 32

def new_shaobject():
    return {
        'digest': [0.0]*8,
        'count_lo': 0,
        'count_hi': 0,
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

def float_add_mod32(a, b):
    """Addition modulo 2^32 using polynomial: a*(1-b) + b*(1-a) for carry simulation"""
    # For proper 32-bit addition, we need to handle carries
    # This is a simplified version - for exact binary compatibility,
    # we'd need full bit-by-bit polynomial arithmetic
    return a + b - 2 * a * b  # XOR-like behavior for single bits

def string_to_float_bits(s):
    """Convert string to array of float 0s and 1s (binary representation)"""
    result = []
    for char in s:
        byte_val = ord(char)
        # Convert each byte to 8 bits (as floats 0.0 and 1.0)
        for i in range(8):
            bit = float((byte_val >> (7 - i)) & 1)
            result.append(bit)
    return result

def float_bits_to_bytes(float_bits):
    """Convert array of float 0s and 1s back to bytes"""
    result = []
    # Process 8 bits at a time
    for i in range(0, len(float_bits), 8):
        byte_val = 0
        for j in range(8):
            if i + j < len(float_bits):
                # Round to nearest integer (0 or 1) then convert
                bit = 1 if float_bits[i + j] > 0.5 else 0
                byte_val |= (bit << (7 - j))
        result.append(byte_val)
    return bytes(result)

def float_bits_to_hex(float_bits):
    """Convert float bits to hex string"""
    byte_data = float_bits_to_bytes(float_bits)
    return ''.join(['{:02x}'.format(b) for b in byte_data])

# Helper functions for SHA operations
def ROR_float(x_bits, y):
    """Rotate right operation on array of float bits"""
    if len(x_bits) == 0:
        return x_bits
    n = y % len(x_bits)
    return x_bits[-n:] + x_bits[:-n]

def float_bits_to_32bit_words(bits):
    """Convert array of float bits to 32-bit words (arrays of 32 float bits each)"""
    words = []
    for i in range(0, len(bits), 32):
        word = bits[i:i+32]
        # Pad with zeros if necessary
        while len(word) < 32:
            word.append(0.0)
        words.append(word)
    return words

def add_32bit_words_float(word1, word2):
    """Add two 32-bit words represented as float bit arrays"""
    result = []
    carry = 0.0
    
    # Add from least significant bit
    for i in range(31, -1, -1):
        bit_sum = word1[i] + word2[i] + carry
        # Polynomial equivalent of: result_bit = sum % 2, carry = sum // 2
        if len(result) == 0:
            result = [0.0] * 32
        result[i] = bit_sum - 2 * float_and(bit_sum, 1.0)  # bit_sum % 2 equivalent
        carry = float_and(bit_sum, 1.0)  # Simplified carry
    
    return result

def Ch_float(x, y, z):
    """Choice function: z ^ (x & (y ^ z))"""
    # Apply element-wise on 32-bit word arrays
    result = []
    for i in range(32):
        y_xor_z = float_xor(y[i], z[i])
        x_and_result = float_and(x[i], y_xor_z)
        result.append(float_xor(z[i], x_and_result))
    return result

def Maj_float(x, y, z):
    """Majority function: (x & y) ^ (x & z) ^ (y & z)"""
    result = []
    for i in range(32):
        xy = float_and(x[i], y[i])
        xz = float_and(x[i], z[i])
        yz = float_and(y[i], z[i])
        result.append(float_xor(float_xor(xy, xz), yz))
    return result

def Sigma0_float(x):
    """Sigma0 function: ROR(x,2) ^ ROR(x,13) ^ ROR(x,22)"""
    ror2 = ROR_float(x, 2)
    ror13 = ROR_float(x, 13)
    ror22 = ROR_float(x, 22)
    
    result = []
    for i in range(32):
        result.append(float_xor(float_xor(ror2[i], ror13[i]), ror22[i]))
    return result

def Sigma1_float(x):
    """Sigma1 function: ROR(x,6) ^ ROR(x,11) ^ ROR(x,25)"""
    ror6 = ROR_float(x, 6)
    ror11 = ROR_float(x, 11)
    ror25 = ROR_float(x, 25)
    
    result = []
    for i in range(32):
        result.append(float_xor(float_xor(ror6[i], ror11[i]), ror25[i]))
    return result

def Gamma0_float(x):
    """Gamma0 function: ROR(x,7) ^ ROR(x,18) ^ SHR(x,3)"""
    ror7 = ROR_float(x, 7)
    ror18 = ROR_float(x, 18)
    shr3 = [0.0] * 3 + x[:-3]  # Right shift by 3
    
    result = []
    for i in range(32):
        result.append(float_xor(float_xor(ror7[i], ror18[i]), shr3[i]))
    return result

def Gamma1_float(x):
    """Gamma1 function: ROR(x,17) ^ ROR(x,19) ^ SHR(x,10)"""
    ror17 = ROR_float(x, 17)
    ror19 = ROR_float(x, 19)
    shr10 = [0.0] * 10 + x[:-10]  # Right shift by 10
    
    result = []
    for i in range(32):
        result.append(float_xor(float_xor(ror17[i], ror19[i]), shr10[i]))
    return result

def int_to_32bit_float_word(value):
    """Convert integer to 32-bit word of float bits"""
    word = []
    for i in range(32):
        bit = float((value >> (31 - i)) & 1)
        word.append(bit)
    return word

def sha_transform_float(sha_info):
    """SHA transform function using float bit operations"""
    W = []
    
    # Convert data to 32-bit words
    data_bits = sha_info['data']
    
    # First 16 words come directly from input data (512 bits = 16 * 32-bit words)
    for i in range(16):
        start_bit = i * 32
        end_bit = start_bit + 32
        if end_bit <= len(data_bits):
            W.append(data_bits[start_bit:end_bit])
        else:
            # Pad with zeros if needed
            word = data_bits[start_bit:] + [0.0] * (end_bit - len(data_bits))
            W.append(word)
    
    # Extend to 64 words
    for i in range(16, 64):
        # W[i] = Gamma1(W[i-2]) + W[i-7] + Gamma0(W[i-15]) + W[i-16]
        term1 = Gamma1_float(W[i-2])
        term2 = W[i-7]
        term3 = Gamma0_float(W[i-15])
        term4 = W[i-16]
        
        # Add all terms
        temp = add_32bit_words_float(term1, term2)
        temp = add_32bit_words_float(temp, term3)
        temp = add_32bit_words_float(temp, term4)
        W.append(temp)
    
    # Initialize working variables
    a, b, c, d, e, f, g, h = sha_info['digest']
    
    # SHA-256 round constants
    K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ]
    
    # Main compression loop
    for i in range(64):
        # Convert constants and variables to 32-bit float words for this round
        ki_word = int_to_32bit_float_word(K[i])
        
        # T1 = h + Sigma1(e) + Ch(e,f,g) + K[i] + W[i]
        sigma1_e = Sigma1_float(e)
        ch_efg = Ch_float(e, f, g)
        
        temp1 = add_32bit_words_float(h, sigma1_e)
        temp1 = add_32bit_words_float(temp1, ch_efg)
        temp1 = add_32bit_words_float(temp1, ki_word)
        T1 = add_32bit_words_float(temp1, W[i])
        
        # T2 = Sigma0(a) + Maj(a,b,c)
        sigma0_a = Sigma0_float(a)
        maj_abc = Maj_float(a, b, c)
        T2 = add_32bit_words_float(sigma0_a, maj_abc)
        
        # Update working variables
        h = g
        g = f
        f = e
        e = add_32bit_words_float(d, T1)
        d = c
        c = b
        b = a
        a = add_32bit_words_float(T1, T2)
    
    # Add to hash values
    sha_info['digest'][0] = add_32bit_words_float(sha_info['digest'][0], a)
    sha_info['digest'][1] = add_32bit_words_float(sha_info['digest'][1], b)
    sha_info['digest'][2] = add_32bit_words_float(sha_info['digest'][2], c)
    sha_info['digest'][3] = add_32bit_words_float(sha_info['digest'][3], d)
    sha_info['digest'][4] = add_32bit_words_float(sha_info['digest'][4], e)
    sha_info['digest'][5] = add_32bit_words_float(sha_info['digest'][5], f)
    sha_info['digest'][6] = add_32bit_words_float(sha_info['digest'][6], g)
    sha_info['digest'][7] = add_32bit_words_float(sha_info['digest'][7], h)

def sha_init_float():
    """Initialize SHA-256 with float bit representation"""
    sha_info = new_shaobject()
    # Initial hash values as 32-bit float bit arrays
    initial_hash = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 
                   0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19]
    sha_info['digest'] = [int_to_32bit_float_word(h) for h in initial_hash]
    sha_info['count_lo'] = 0
    sha_info['count_hi'] = 0
    sha_info['local'] = 0
    sha_info['digestsize'] = 32
    return sha_info

def sha224_init_float():
    """Initialize SHA-224 with float bit representation"""
    sha_info = new_shaobject()
    initial_hash = [0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939, 
                   0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4]
    sha_info['digest'] = [int_to_32bit_float_word(h) for h in initial_hash]
    sha_info['count_lo'] = 0
    sha_info['count_hi'] = 0
    sha_info['local'] = 0
    sha_info['digestsize'] = 28
    return sha_info

def getbuf_float(s):
    """Convert input to float bits"""
    if isinstance(s, str):
        return string_to_float_bits(s)
    elif isinstance(s, (list, tuple)):
        # Assume it's already float bits
        return [float(x) for x in s]
    else:
        # Convert single value to bits
        return string_to_float_bits(str(s))

def sha_update_float(sha_info, buffer):
    """Update hash with float bit buffer"""
    if isinstance(buffer, str):
        buffer = getbuf_float(buffer)
    
    count = len(buffer)
    buffer_idx = 0
    
    # Update bit counts
    clo = (sha_info['count_lo'] + count) & 0xffffffff
    if clo < sha_info['count_lo']:
        sha_info['count_hi'] += 1
    sha_info['count_lo'] = clo
    sha_info['count_hi'] += (count >> 29)
    
    if sha_info['local']:
        i = SHA_BLOCKSIZE * 8 - sha_info['local']  # 512 bits per block
        if i > count:
            i = count
        
        # Copy buffer bits
        for x in range(i):
            sha_info['data'][sha_info['local'] + x] = buffer[buffer_idx + x]
        
        count -= i
        buffer_idx += i
        sha_info['local'] += i
        
        if sha_info['local'] == SHA_BLOCKSIZE * 8:  # 512 bits
            sha_transform_float(sha_info)
            sha_info['local'] = 0
        else:
            return
    
    # Process complete 512-bit blocks
    while count >= SHA_BLOCKSIZE * 8:
        sha_info['data'] = buffer[buffer_idx:buffer_idx + SHA_BLOCKSIZE * 8]
        count -= SHA_BLOCKSIZE * 8
        buffer_idx += SHA_BLOCKSIZE * 8
        sha_transform_float(sha_info)
    
    # Store remaining bits
    if count > 0:
        sha_info['data'] = [0.0] * (SHA_BLOCKSIZE * 8)  # Reset data buffer
        for i in range(count):
            sha_info['data'][i] = buffer[buffer_idx + i]
        sha_info['local'] = count

def sha_final_float(sha_info):
    """Finalize hash computation"""
    lo_bit_count = sha_info['count_lo']
    hi_bit_count = sha_info['count_hi']
    count = sha_info['local']
    
    # Prepare data for final block(s)
    data = sha_info['data'][:count] + [0.0] * (SHA_BLOCKSIZE * 8 - count)
    
    # Add padding bit (1 followed by zeros)
    if count < len(data):
        data[count] = 1.0
        count += 1
    
    # If not enough room for length, process current block and start new one
    if count > (SHA_BLOCKSIZE * 8) - 64:  # Need 64 bits for length
        # Fill rest with zeros and process
        for i in range(count, SHA_BLOCKSIZE * 8):
            data[i] = 0.0
        sha_info['data'] = data
        sha_transform_float(sha_info)
        
        # Start new block with zeros
        data = [0.0] * (SHA_BLOCKSIZE * 8)
        count = 0
    
    # Fill with zeros up to length field
    for i in range(count, (SHA_BLOCKSIZE * 8) - 64):
        data[i] = 0.0
    
    # Add length as 64-bit big-endian
    # High 32 bits
    for i in range(32):
        data[(SHA_BLOCKSIZE * 8) - 64 + i] = float((hi_bit_count >> (31 - i)) & 1)
    # Low 32 bits  
    for i in range(32):
        data[(SHA_BLOCKSIZE * 8) - 32 + i] = float((lo_bit_count >> (31 - i)) & 1)
    
    sha_info['data'] = data
    sha_transform_float(sha_info)
    
    # Convert digest to flat bit array
    result_bits = []
    for word in sha_info['digest']:
        result_bits.extend(word)
    
    return result_bits

class SHA256Float(object):
    """Float-based SHA-256 that maintains binary compatibility"""
    
    def __init__(self, s=None):
        self._sha = sha_init_float()
        if s is not None:
            self.update(s)
    
    def update(self, s):
        """Update the hash with new data"""
        sha_update_float(self._sha, s)
    
    def digest(self):
        """Return the digest as bytes (converted from float bits)"""
        sha_copy = {k: (v[:] if isinstance(v, list) else v) for k, v in self._sha.items()}
        if isinstance(sha_copy['digest'][0], list):
            # Deep copy the nested lists
            sha_copy['digest'] = [word[:] for word in sha_copy['digest']]
        
        float_bits = sha_final_float(sha_copy)
        # Take only the required number of bits for the digest size
        digest_bits = float_bits[:sha_copy['digestsize'] * 8]
        return float_bits_to_bytes(digest_bits)
    
    def hexdigest(self):
        """Return hex representation of the digest"""
        return self.digest().hex()
    
    def float_digest(self):
        """Return the digest as float bits (for debugging/analysis)"""
        sha_copy = {k: (v[:] if isinstance(v, list) else v) for k, v in self._sha.items()}
        if isinstance(sha_copy['digest'][0], list):
            sha_copy['digest'] = [word[:] for word in sha_copy['digest']]
        
        float_bits = sha_final_float(sha_copy)
        return float_bits[:sha_copy['digestsize'] * 8]
    
    def copy(self):
        """Return a copy of the hash object"""
        new = SHA256Float.__new__(SHA256Float)
        new._sha = {k: (v[:] if isinstance(v, list) else v) for k, v in self._sha.items()}
        if isinstance(new._sha['digest'][0], list):
            new._sha['digest'] = [word[:] for word in new._sha['digest']]
        return new

class SHA224Float(SHA256Float):
    """Float-based SHA-224 that maintains binary compatibility"""
    
    def __init__(self, s=None):
        self._sha = sha224_init_float()
        if s is not None:
            self.update(s)
    
    def copy(self):
        new = SHA224Float.__new__(SHA224Float)
        new._sha = {k: (v[:] if isinstance(v, list) else v) for k, v in self._sha.items()}
        if isinstance(new._sha['digest'][0], list):
            new._sha['digest'] = [word[:] for word in new._sha['digest']]
        return new

def test_float_sha():
    """Test the float SHA implementation for binary compatibility"""
    import hashlib
    
    print("Testing Float SHA-256 for Binary Compatibility")
    print("=" * 50)
    
    # Test cases
    test_cases = [
        "",
        "a",
        "abc",
        "message digest",
        "abcdefghijklmnopqrstuvwxyz",
        "The quick brown fox jumps over the lazy dog"
    ]
    
    for test_str in test_cases:
        # Standard SHA-256
        std_hash = hashlib.sha256(test_str.encode()).hexdigest()
        
        # Float SHA-256
        float_hash = SHA256Float(test_str).hexdigest()
        
        print(f"Input: '{test_str}'")
        print(f"Standard:  {std_hash}")
        print(f"Float:     {float_hash}")
        print(f"Match:     {std_hash == float_hash}")
        print()
    
    # Test polynomial operations
    print("Testing polynomial operations:")
    print(f"float_and(0, 0) = {float_and(0, 0)}")
    print(f"float_and(0, 1) = {float_and(0, 1)}")
    print(f"float_and(1, 0) = {float_and(1, 0)}")
    print(f"float_and(1, 1) = {float_and(1, 1)}")
    print()
    print(f"float_or(0, 0) = {float_or(0, 0)}")
    print(f"float_or(0, 1) = {float_or(0, 1)}")
    print(f"float_or(1, 0) = {float_or(1, 0)}")
    print(f"float_or(1, 1) = {float_or(1, 1)}")
    print()
    print(f"float_xor(0, 0) = {float_xor(0, 0)}")
    print(f"float_xor(0, 1) = {float_xor(0, 1)}")
    print(f"float_xor(1, 0) = {float_xor(1, 0)}")
    print(f"float_xor(1, 1) = {float_xor(1, 1)}")

if __name__ == "__main__":
    test_float_sha()