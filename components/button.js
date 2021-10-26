import React from 'react';

import { Button as ChakraButton } from '@chakra-ui/react';
import { motion } from "framer-motion";

export default function Button({ isDisabled, ...rest }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: isDisabled ? 1.05 : 0.95 }}
    >
      <ChakraButton as="div"
        isDisabled={isDisabled}
        {...rest}
      />
    </motion.button>
  )
}