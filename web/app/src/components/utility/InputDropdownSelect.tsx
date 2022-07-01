import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import styled from '@emotion/styled';
import { useTypedTheme } from 'src/hooks';

interface InputDropdownSelectProps {
  options: string[];
  onSearch: (inputVal: string) => void;
  inputError: boolean;
  setInputError: React.Dispatch<React.SetStateAction<boolean>>;
}

type FuseResults = Fuse.FuseResult<string>[];

// this entire component could be pulled from an existing open source library
// but I wanted to have some fun, so I build my own
export const InputDropdownSelect: React.VFC<InputDropdownSelectProps> = ({
  options,
  onSearch,
  inputError,
  setInputError,
}) => {
  const theme = useTypedTheme();

  const [inputVal, setInputVal] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchedOptions, setSearchOptions] = useState<FuseResults>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');

  const fuse = useMemo(() => new Fuse(options), [options]);
  const clearInput = useCallback(() => setInputVal(''), []);
  const onInputFocus = useCallback(() => setIsInputFocused(true), []);
  const onInputBlur = useCallback(
    () => setTimeout(() => setIsInputFocused(false), 100),
    [],
  );

  const onTimezoneSearch = () => {
    if (options.includes(inputVal)) {
      onSearch(inputVal);
      return;
    }

    setInputError(true);
  };

  const isDropdownOptionVisible =
    isInputFocused && searchedOptions.length > 0 && selectedOption !== inputVal;

  useEffect(() => {
    if (inputVal.length > 0) {
      const fuzzySearchedOptions = fuse.search(inputVal, { limit: 15 });
      setSearchOptions(fuzzySearchedOptions);
    } else {
      setSearchOptions([]);
    }
  }, [inputVal, fuse]);

  return (
    <InputContainer>
      <InputWrapper>
        <Input
          placeholder="Timezone.."
          onChange={event => {
            setInputError(false);
            setInputVal(event.currentTarget.value);
          }}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              onTimezoneSearch();
            }
          }}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          focusedBorderColor={
            inputError ? theme.colors.darkRed : theme.colors.blue
          }
          value={inputVal}
        />
        <OptionsContainer isVisible={isDropdownOptionVisible}>
          {searchedOptions.map(({ item: timezone }) => {
            return (
              <Option
                key={timezone}
                type="button"
                onClick={() => {
                  setInputError(false);
                  setInputVal(timezone);
                  setSelectedOption(timezone);
                }}>
                {timezone}
              </Option>
            );
          })}
        </OptionsContainer>
      </InputWrapper>

      <ButtonWrapper>
        <ActionButton
          type="button"
          aria-label="search for time in timezone"
          onClick={onTimezoneSearch}
          bgColor={theme.colors.green}
          hoverColor={theme.colors.darkGreen}>
          Search
        </ActionButton>
        <ActionButton
          type="button"
          aria-label="clear timezone input"
          onClick={clearInput}
          bgColor={theme.colors.red}
          hoverColor={theme.colors.darkRed}>
          Clear
        </ActionButton>
      </ButtonWrapper>
    </InputContainer>
  );
};

const InputContainer = styled.div`
  display: grid;
  grid-template-columns: 3.5fr 1fr;
  grid-template-rows: 1fr;
  gap: 0.75rem;
  width: 100%;
  max-width: 40rem;
  margin: 0 auto;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const OptionsContainer = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  position: absolute;
  width: 100%;
  max-height: 15rem;
  overflow-y: scroll;
  border: 1px solid #d9d9d9;
  border-radius: 0.75rem;

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #d9d9d9 transparent;

  ::-webkit-scrollbar {
    width: 0.25rem;
    height: 0.25rem;
  }

  ::-webkit-scrollbar-track {
    border-radius: 25px;
    border: 1px solid #d9d9d9;
  }

  ::-webkit-scrollbar-track-piece {
    height: 98%;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 25px;
    background: #d9d9d9;
  }
`;

const Option = styled.button`
  border: none;
  padding: 0.25rem 0.75rem;
  width: 100%;
  background-color: white;
  transition: background 0.3s;

  :hover {
    background-color: #f2f2f2;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  padding-bottom: 1rem;
  width: 100%;

  & > button:not(:last-of-type) {
    margin-right: 0.5rem;
  }
`;

const ActionButton = styled.button<{
  bgColor: string;
  hoverColor: string;
}>`
  border: none;
  color: white;
  background: ${props => props.bgColor};
  font-weight: bold;
  font-size: 1.125rem;
  padding: 0.5rem 1rem;
  transition: background 0.25s ease-in-out;
  border-radius: 0.75rem;

  &:hover,
  &:focus {
    background: ${props => props.hoverColor};
    cursor: pointer;
  }

  @media only screen and (min-width: 1200px) {
    font-size: 1.6rem;
  }
`;

const Input = styled.input<{ focusedBorderColor: string }>`
  font-size: 1.125rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  border-style: none;
  border: 1px solid black;
  margin-bottom: 1rem;
  width: 100%;

  &:focus-visible {
    outline: none;
    border: 1px solid ${({ focusedBorderColor }) => focusedBorderColor};
    box-shadow: 0 0 1px 1px ${({ focusedBorderColor }) => focusedBorderColor};
  }

  @media only screen and (min-width: 1200px) {
    font-size: 1.6rem;
    padding: 0.5rem 1.25rem;
  }
`;
